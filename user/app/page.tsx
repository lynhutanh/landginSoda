import { Metadata } from 'next';
import SodaLandingClient from './components/SodaLandingClient';

export const metadata: Metadata = {
  title: 'Diet Soda | Pure Zero Refreshment',
  description: 'Experience the crisp, clean taste of Diet Soda. Zero sugar, zero compromise.',
  openGraph: {
    title: 'Diet Soda | Pure Zero Refreshment',
    description: 'Experience the crisp, clean taste of Diet Soda. Zero sugar, zero compromise.',
  }
};

export default function Home() {
  return <SodaLandingClient />;
}
