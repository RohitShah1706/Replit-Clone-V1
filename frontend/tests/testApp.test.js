import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {Demo} from '../app/demo';

test('renders learn react link', () => {
    render(<Demo />);
    const linkElement = screen.getByText(/demo text/);
    console.log(linkElement);
    expect(linkElement).toBeInTheDocument();
});

// test('renders header', () => {
//     render(<Home />);
//     const headerElement = screen.getByRole('heading', { name: /welcome to my Home/i });
//     expect(headerElement).toBeInTheDocument();
// });

// test('button click changes text', () => {
//     render(<Home />);
//     const buttonElement = screen.getByRole('button', { name: /click me/i });
//     buttonElement.click();
//     const changedText = screen.getByText(/you clicked the button/i);
//     expect(changedText).toBeInTheDocument();
// });