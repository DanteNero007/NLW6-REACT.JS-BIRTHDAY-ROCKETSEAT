import { useContext} from 'react';
import {ThemeContext} from '../contexts/ThemeContext';

export function useTheme(){
    const theme = useContext(ThemeContext);

    return theme;
}

