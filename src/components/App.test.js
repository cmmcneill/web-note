import { render } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('App renders', () => {
    const comp = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    expect(comp.container.querySelector('.under-nav')).toBeInTheDocument();
});