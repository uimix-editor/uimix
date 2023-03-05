import { useSession, signIn, signOut } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();
  if (session?.user) {
    return (
      <div className="flex flex-col gap-1 items-start">
        Signed in as {session.user.email} <br />
        <div className="flex gap-1">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signOut()}
          >
            Sign out
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signIn()}
          >
            Connect another account
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1 items-start">
      Not signed in <br />
      <div className="flex gap-1">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
