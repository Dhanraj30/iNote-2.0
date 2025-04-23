//src/app/dashboard/page.tsx
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Coffee, Grid3X3, List } from "lucide-react"
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db"
import { $notes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateNoteDialog from "@/components/CreateNoteDialog"
import { redirect } from "next/navigation";
//import { headers } from "next/headers"

type Props = {}

const DashboardPage = async ( props: Props ) => {
  // Initialize Supabase client
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  // Handle sign-out
  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }
  //const headersData = await headers()
  const notes = await db.select().from($notes).where(eq($notes.userId, user.id))

  return (
    <>
    <div className="min-h-screen bg-[#f8f5e6] bg-[url('/paper-texture.svg')]">
      {/* Left binding effect */}
      <div className="fixed left-0 top-0 bottom-0 w-6 md:w-12 bg-[#e2d9bc] shadow-inner">
        <div className="h-full flex flex-col justify-between py-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-full h-2 bg-[#d1c7a3] rounded-full shadow-sm" />
          ))}
        </div>
      </div>

      <div className="pl-8 md:pl-16 pr-4 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#d1c7a3] pb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-[#5c4f3a] hover:text-[#8a7456] hover:bg-[#e9e2cc] rounded-xl flex gap-2 items-center"
              >
                <ArrowLeft size={18} />
                <span className="font-serif">Back</span>
              </Button>
            </Link>

            <h1 className="text-2xl md:text-3xl font-serif text-[#5c4f3a] font-bold flex items-center gap-3">
              My Notes
            </h1>

            {/* Replace UserButton with user avatar or sign-out button */}
            <form action={handleSignOut}>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0"
                  title="Sign out"
                >
                  <span className="h-10 w-10 rounded-full bg-[#e9e2cc] flex items-center justify-center text-[#5c4f3a] font-serif">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </Button>
              </form>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7456]" />
              <Input
                placeholder="Search notes..."
                className="pl-9 bg-[#e9e2cc] border-[#d1c7a3] text-[#5c4f3a] w-[200px] rounded-xl focus-visible:ring-[#8a7456]"
              />
            </div>

            <div className="flex border border-[#d1c7a3] rounded-lg overflow-hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none bg-[#e9e2cc] text-[#5c4f3a]">
                <Grid3X3 size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none bg-transparent text-[#5c4f3a]">
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-[#e9e2cc] p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-[#f8f5e6] data-[state=active]:text-[#5c4f3a] data-[state=active]:shadow-sm text-[#8a7456] font-serif"
            >
              All Notes
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="rounded-lg data-[state=active]:bg-[#f8f5e6] data-[state=active]:text-[#5c4f3a] data-[state=active]:shadow-sm text-[#8a7456] font-serif"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="rounded-lg data-[state=active]:bg-[#f8f5e6] data-[state=active]:text-[#5c4f3a] data-[state=active]:shadow-sm text-[#8a7456] font-serif"
            >
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CreateNoteDialog />
          {notes.map((note) => (
            <Link href={`/notebook/${note.id}`} key={note.id}>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-[#d1c7a3] rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl overflow-hidden bg-[#f8f5e6] border border-[#d1c7a3] shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden bg-[#e9e2cc]">
                    {note.imageUrl && (
                      <Image
                        src={note.imageUrl || "/placeholder.svg"}
                        alt={note.name}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-3 flex flex-col">
                    <h3 className="font-serif text-[#5c4f3a] font-medium line-clamp-1">{note.name}</h3>
                    <time className="text-xs text-[#8a7456] mt-1 font-serif">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center mt-10">
            <h2 className="text-xl text-[#8a7456] font-serif">You have no notes yet.</h2>
            <p className="text-[#5c4f3a] mt-2 font-serif">Create your first note to get started!</p>
          </div>
        )}

        {/* Tip */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[#8a7456] font-serif italic">
          <Coffee size={16} />
          <span>build with Coffe!</span>
        </div>
      </div>
    </div>
  </>
  )
}

export default DashboardPage

