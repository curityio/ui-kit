import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input component', () => {
  it('should render the input with the provided label', () => {
    render(<Input label="Username" id="username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should handle input types correctly', () => {
    render(<Input label="Text Input" type="text" id="text-input" />);

    const textInput = screen.getByLabelText('Text Input');

    expect(textInput).toHaveAttribute('type', 'text');

    render(<Input label="Number Input" type="number" id="number-input" />);

    const numberInput = screen.getByLabelText('Number Input');

    expect(numberInput).toHaveAttribute('type', 'number');

    render(<Input label="Password Input" type="password" id="password-input" />);

    const passwordInput = screen.getByLabelText('Password Input');

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should apply the provided class names', () => {
    render(
      <Input
        label="Username"
        id="username"
        className="custom-container"
        inputClassName="custom-input"
        labelClassName="custom-label"
      />
    );

    const container = screen.getByTestId('input-container');

    expect(container).toHaveClass('custom-container');
    expect(screen.getByLabelText('Username')).toHaveClass('custom-input');
    expect(screen.getByText('Username')).toHaveClass('custom-label');
  });

  it('should show the tooltip when provided and no error is present', () => {
    render(<Input label="Username" id="username" tooltip="Enter your username" />);

    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('should not show the tooltip when an error is present', () => {
    render(<Input label="Username" id="username" tooltip="Enter your username" error="Required field" />);

    expect(screen.queryByText('Enter your username')).not.toBeInTheDocument();
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('should show the warning message when provided and no error is present', () => {
    render(<Input label="Username" id="username" warning="Be careful!" />);
    expect(screen.getByText('Be careful!')).toBeInTheDocument();
  });

  it('should handle focus and blur events correctly', () => {
    render(<Input label="Username" id="username" />);

    const input = screen.getByLabelText('Username');

    expect(screen.getByText('Username')).not.toHaveClass('focused');
    fireEvent.focus(input);
    expect(screen.getByText('Username')).toHaveClass('focused');
    fireEvent.blur(input);
    expect(screen.getByText('Username')).not.toHaveClass('focused');
  });

  it('should call the onChange handler when the input value changes', () => {
    let updatedValue;
    render(<Input label="Username" id="username" onChange={event => (updatedValue = event.target.value)} />);

    const input = screen.getByLabelText('Username');
    const testValue = 'New value';

    fireEvent.change(input, { target: { value: testValue } });

    expect(updatedValue).toBe(testValue);
  });

  it('should support ref forwarding', () => {
    const inputRef = { current: null } as unknown as React.RefObject<HTMLInputElement>;

    render(<Input label="Username" id="username" ref={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });
});
