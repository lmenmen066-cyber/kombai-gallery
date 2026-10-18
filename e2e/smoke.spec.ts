import { test, expect } from '@playwright/test'

test('home renders the (non-animated) hero headline and nav', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('A quiet, editorial')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Get started' }).or(page.getByRole('button', { name: 'Get started' })).first(),
  ).toBeVisible()
})

test('command palette switches to dark mode (⌘K → "Dark mode")', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  const combobox = page.getByRole('combobox')
  await expect(combobox).toBeVisible()
  await combobox.fill('dark')
  await page.getByRole('option', { name: /Dark mode/ }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  // palette closes after running a command
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('pricing billing toggle changes the rendered price', async ({ page }) => {
  await page.goto('/pricing')
  await expect(page.getByText(/scale with/i).first()).toBeVisible()
  // default is Annual (Pro = $19/mo); switching to Monthly shows $24
  await expect(page.getByText('$19').first()).toBeVisible()
  await page.getByRole('button', { name: 'Monthly' }).click()
  await expect(page.getByText('$24').first()).toBeVisible()
})
