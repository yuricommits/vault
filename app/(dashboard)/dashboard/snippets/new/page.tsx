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
        <h2 className="text-2xl font-bold text-gray-900">New Snippet</h2>
        <p className="text-gray-500 text-sm mt-1">
          Add a new code snippet to your Vault
        </p>
      </div>
      <NewSnippetForm />
    </div>
  );
}
