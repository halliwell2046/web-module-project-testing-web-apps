import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.getByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent("Contact Form");
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getAllByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, "test");
    await waitFor(() => {
        expect(
            screen.queryByText(/firstName must have at least 5 characters./i)
        ).toBeInTheDocument();
    });
    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
   const button = screen.getByRole("button")
    userEvent.click(button);
    const error = await screen.findAllByText(/error/i);
    expect(error.length).toEqual(3);
    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render (<ContactForm />);
    const firstName = screen.getByLabelText("First Name");
    userEvent.type(firstName, "Greg");

    const lastName = screen.getByLabelText("Last Name");
    userEvent.type(lastName, "Kemp");

    const email = screen.getByLabelText("Email");
    userEvent.type(email, "halliwell2046@yahoo.com");

    const error = await screen.findAllByText(/error/i);

    expect(error.length).toEqual(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render (<ContactForm />);
    const emailValue = screen.getByLabelText(/Email*/i);
    userEvent.type(emailValue, "invalidemail");
    await waitFor(() => {
        expect(
            screen.queryByText(/Error: email must be a valid email address./i)
        ).toBeInTheDocument();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const lastNameValue = screen.getByLabelText("Last Name");
    userEvent.type(lastNameValue, "");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    expect(screen.getByText("Error: lastName is a required field."));
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText("First Name");
    userEvent.type(firstNameInput, "Gavyn");
    const lastNameInput = screen.getByLabelText("Last Name");
    userEvent.type(lastNameInput, "Kemp");
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "halliwell2046@gmail.com");
    const buttonInput = screen.getByRole("button");
    userEvent.click(buttonInput);

    const firstNameSubmitted = await screen.getAllByText(/Gavyn/i);
    const lastNameSubmitted = await screen.getAllByText(/Kemp/i);
    const emailSubmitted = await screen.getAllByText(/halliwell2046@gmail.com/i);

    expect(firstNameSubmitted).toBeVisible;
    expect(lastNameSubmitted).toBeVisible;
    expect(emailSubmitted).toBeVisible;
    
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText("First Name");
    userEvent.type(firstNameInput, "Gavyn");
    const lastNameInput = screen.getByLabelText("Last Name");
    userEvent.type(lastNameInput, "Kemp");
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "halliwell2046@gmail.com");
    const messageInput = screen.getByLabelText("Message")
    userEvent.type(messageInput, "That's George McFly.");
    const buttonInput = screen.getByRole("button");
    userEvent.click(buttonInput);
    
    const firstNameSubmitted = await screen.getAllByText(/Gavyn/i);
    const lastNameSubmitted = await screen.getAllByText(/Kemp/i);
    const messageSubmitted = await screen.getAllByText(/halliwell2046@gmail.com/i)

    expect(firstNameSubmitted).toBeVisible;
    expect(lastNameSubmitted).toBeVisible;
    expect(emailSubmitted).toBeVisible;
    expect(messageSubmitted).toBeVisible;
});