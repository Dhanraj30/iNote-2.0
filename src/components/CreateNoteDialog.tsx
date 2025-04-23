"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  /*
  const uploadToSupabase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post("/api/uploadToSupabase", {
        noteId,
      });
      return response.data;
    },
  });*/
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("created new note:", { note_id });
        
        //uploadToSupabase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new notebook");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#e57373] bg-[#e9e2cc]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#e9e2cc]/50 transition-colors group">
          <div className="h-12 w-12 rounded-full bg-[#e9e2cc] flex items-center justify-center group-hover:bg-[#e57373]/20 transition-colors">
            <Plus className="h-6 w-6 text-[#e57373]" />
          </div>
          <span className="mt-2 font-serif text-[#e57373] font-medium">New Note Book</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-[#f7664d] hover:bg-[#f72424] text-white font-serif"
              disabled={createNotebook.isLoading}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
