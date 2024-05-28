const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Bloglist', () => {
    beforeEach(async ({ page, request }) => {
        await page.waitForTimeout(1000)
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test Johnson',
                username: 'tjohn',
                password: 'guest'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('yleinen')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('textbox').first().fill('mluukkai')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog post' }).click()

            await page.getByTestId('title').fill('testblog1')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()

            await page.waitForTimeout(5000)

            await expect(page.getByText('testblog1')).toBeVisible()
        })

        test('blog is liked', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog post' }).click()

            await page.getByTestId('title').fill('testblog2')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()

            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()

            await expect(page.getByText('likes: 1')).toBeVisible()
        })

        test('blog is deleted', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog post' }).click()

            await page.getByTestId('title').fill('testblog2')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()

            await page.waitForTimeout(5000)

            await page.getByRole('button', { name: 'view' }).click()
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()

            await expect(page.getByText('testblog2')).not.toBeVisible()
        })

        test('remove button only visible to the user', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog post' }).click()

            await page.getByTestId('title').fill('testblog3')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()

            await page.getByRole('button', { name: 'log out' }).click()

            await page.getByRole('textbox').first().fill('tjohn')
            await page.getByRole('textbox').last().fill('guest')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByRole('button', { name: 'submit' })).not.toBeVisible()

        })

        test('blogs sort based on likes', async ({ page }) => {
            page.pause()
            await page.getByRole('button', { name: 'create new blog post' }).click()

            await page.getByTestId('title').fill('testblog3')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()

            await page.getByTestId('title').fill('testblog4')
            await page.getByTestId('author').fill('Testson')
            await page.getByTestId('url').fill('test.com')

            await page.getByRole('button', { name: 'submit' }).click()


            page.locator(':nth-match(:text("view"), 2)').click()

            await page.getByRole('button', { name: 'like' }).click()

            await page.reload()

            page.locator(':nth-match(:text("view"), 1)').click()

            await expect(page.getByText('likes: 1')).toBeVisible()
        })

    })
})