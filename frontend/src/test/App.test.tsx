import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../main/app/App';

test('renders learn react link', () => {
    render(<p>My data</p>);
    const linkElement = screen.getByText("My data");
    expect(linkElement).toBeInTheDocument();
});
