import { render, screen } from '@testing-library/react';
import __NAME__ from '../components/__NAME__/__NAME__';

test('renders __NAME__ component', () => {
  render(<__NAME__ />);
  const element = screen.getByText(/__NAME__ component/i);
  expect(element).toBeInTheDocument();
});
