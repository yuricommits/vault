import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewSnippetForm from "@/components/new-snippet-form";

export default async function NewSnippetPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-[#666666] mb-2">// NEW SNIPPET</p>
        <h2 className="text-xl text-white font-bold">Add a snippet.</h2>
      </div>
      <NewSnippetForm />
    </div>
  );
}
