import { mount } from 'svelte';
import '../src/themes.css';
import Showcase from './Showcase.svelte';

mount(Showcase, { target: document.getElementById('app') });
