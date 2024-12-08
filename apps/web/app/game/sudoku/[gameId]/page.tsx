export default async function GameId({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const gameId = (await params).gameId;
  return <div>{gameId}</div>;
}
