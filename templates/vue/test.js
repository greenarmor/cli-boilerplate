import { render, screen } from '@testing-library/vue';
import __NAME__ from '../components/__NAME__/__NAME__.vue';

test('renders __NAME__ component', () => {
  render(__NAME__);
  const element = screen.getByText(/__NAME__ component/i);
  expect(element).toBeInTheDocument();
});
