import { JSONContent } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef, useState } from "react";
import { mediaProps } from "../types/media";

import {
  HeadingWithAnchor,
  insertImages,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddImage,
  MenuButtonAddTable,
  MenuButtonAlignCenter,
  MenuButtonAlignJustify,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  ResizableImage,
  RichTextEditor,
  RichTextEditorRef,
  TableBubbleMenu,
  TableImproved,
} from "mui-tiptap";

import { cleanTiptapJson, getThumbnailUrl } from "@shared/utils/Hooks";
import MediaPicker from "./MediaPicker";

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

export const extensions = [
  // We use some but not all of the extensions from
  // https://tiptap.dev/api/extensions/starter-kit, plus a few additional ones
  TableImproved.configure({
    resizable: true,
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: "my-custom-paragraph",
    },
  }),
  Document,
  Heading.configure({
    HTMLAttributes: {
      class: "my-custom-heading",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TableRow,
  TableHeader,
  TableCell,
  BulletList,
  Document,
  HardBreak,
  ListItem,
  OrderedList,
  Paragraph,
  CustomSubscript,
  CustomSuperscript,
  Text,
  Color,
  TextStyle,
  Highlight,
  Underline,
  Bold,
  Blockquote,

  Italic,
  Strike,
  CustomLinkExtension.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
  }),
  LinkBubbleMenuHandler,
  Gapcursor,

  HeadingWithAnchor.configure({
    levels: [1, 2, 3, 4, 5],
  }),

  ResizableImage,
  Dropcursor,

  TaskList,
  TaskItem.configure({
    nested: true,
  }),

  Placeholder.configure({
    placeholder: "Place your content...",
  }),

  // We use the regular `History` (undo/redo) extension when not using
  // collaborative editing
  History,
];

interface EditorProps {
  value: JSONContent | null;
  setValue: (value: JSONContent) => void;
}

export default function PageContentWithEditor({
  value,
  setValue,
}: EditorProps) {
  const rteRef = useRef<RichTextEditorRef | null>(null);

  const [thumbnail, setThumbnail] = useState(false);

  function handleAddImage(image: mediaProps | mediaProps[]) {
    if (!rteRef.current) return;

    if (!image || Array.isArray(image)) return null;

    const attributesForImageFile = {
      src: getThumbnailUrl(image) || "",
      alt: image.file_name,
    };

    insertImages({
      images: [attributesForImageFile],
      editor: rteRef.current.editor,
      position: 1,
    });
  }

  useEffect(() => {
    if (rteRef.current && rteRef.current.editor) {
      rteRef.current.editor.commands.setContent(cleanTiptapJson(value));
    }
  }, []);

  return (
    <div id="post-content">
      <RichTextEditor
        ref={rteRef}
        content={value}
        className="post-editor tiptap post-content bg-white   w-full"
        onUpdate={() => setValue(rteRef.current?.editor?.getJSON() ?? [])}
        extensions={extensions}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonHighlightColor />
            <MenuButtonTextColor />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonAlignLeft />
            <MenuButtonAlignCenter />
            <MenuButtonAlignRight />
            <MenuButtonAlignJustify />
            <MenuButtonStrikethrough />
            <MenuButtonSubscript />
            <MenuButtonSuperscript />

            <MenuDivider />

            <MenuButtonEditLink />

            <MenuDivider />

            <MenuButtonOrderedList />
            <MenuButtonBulletedList />
            <MenuButtonTaskList />

            <MenuDivider />

            <MenuButtonBlockquote />

            <MenuDivider />

            <MenuButtonAddTable />

            <MenuDivider />

            <MenuButtonAddImage onClick={() => setThumbnail(true)} />

            <MenuButtonRemoveFormatting />
          </MenuControlsContainer>
        )}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>
      <MediaPicker
        multiple={false}
        open={thumbnail}
        setOpen={setThumbnail}
        onSelect={handleAddImage}
      />
    </div>
  );
}


