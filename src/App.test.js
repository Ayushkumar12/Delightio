import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Delightio brand text', () => {
  render(<App />);
  const brandElement = screen.getByText(/Delightio/i);
  expect(brandElement).toBeInTheDocument();
});
