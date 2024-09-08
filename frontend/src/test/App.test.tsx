import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../main/app/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('Image is correctly rendered', async () => {
  const renderedPage = render(<App />);
  const element = renderedPage.container.querySelector('#appLogo');
  expect(element?.getAttribute('src')).toBe('logo.svg');
});
