import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import AIShowcase from "@/components/landing/ai-showcase";
import Changelog from "@/components/landing/changelog";
import Footer from "@/components/landing/footer";

export default async function HomePage() {
    const session = await auth();
    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen relative">
            <div className="grid-bg" />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <AIShowcase />
            <Changelog />
            <Footer />
        </main>
    );
}
