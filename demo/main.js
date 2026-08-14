import { mount } from 'svelte';
import '../src/tokens/theme.css';
import '../src/tokens/tikpro.css';
import Showcase from './Showcase.svelte';

mount(Showcase, { target: document.getElementById('app') });
