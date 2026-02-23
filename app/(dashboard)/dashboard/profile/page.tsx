import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-mono text-white">profile</h2>
        <p className="text-white/30 text-xs mt-1">your account details</p>
      </div>

      <div className="space-y-6 max-w-md">
        <div className="bg-[#0d0d0d] border border-white/10 p-6 space-y-4">
          <div>
            <p className="text-xs text-[#666666] mb-1">name</p>
            <p className="text-sm font-mono text-white">{user?.name || "—"}</p>
          </div>
          <div className="border-t border-white/5" />
          <div>
            <p className="text-xs text-[#666666] mb-1">email</p>
            <p className="text-sm font-mono text-white">{user?.email || "—"}</p>
          </div>
          <div className="border-t border-white/5" />
          <div>
            <p className="text-xs text-[#666666] mb-1">user id</p>
            <p className="text-xs font-mono text-white/20">{user?.id || "—"}</p>
          </div>
        </div>

        <p className="text-xs text-white/20">account management coming soon.</p>
      </div>
    </div>
  );
}
