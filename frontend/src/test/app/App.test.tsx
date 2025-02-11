import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import App from '../../main/app/App';

describe("App root DOM node unit test suite", () => {
    test('renders learn react link', () => {
        render(<App/>);
        const linkElement = screen.getByText("Bonjour!");
        expect(linkElement).toBeInTheDocument();
    })
})
