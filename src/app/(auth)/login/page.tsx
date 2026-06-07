import { redirect } from 'next/navigation';

type LoginPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl ? `?callbackUrl=${encodeURIComponent(params.callbackUrl)}` : '';

  redirect(`/account/signin${callbackUrl}`);
}
