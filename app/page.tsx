import Game from '@/components/game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <h1 className="mb-8 text-4xl font-bold text-white">Aerial Combat</h1>
      <Game />
    </main>
  );
}