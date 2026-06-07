import { redirect } from 'next/navigation';

type RegisterPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl ? `?callbackUrl=${encodeURIComponent(params.callbackUrl)}` : '';

  redirect(`/account/signup${callbackUrl}`);
}
