import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import { describe } from 'node:test';

describe("App root DOM node unit test suite", ()=>{
    test('renders learn react link', () => {
        render(<p>My data</p>);
        const linkElement = screen.getByText("My data");
        expect(linkElement).toBeInTheDocument();
    })
})
