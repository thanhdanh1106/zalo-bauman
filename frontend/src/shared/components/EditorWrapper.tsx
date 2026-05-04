import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import React from 'react';

type Props = {
  editor: React.ReactNode;
  preview?: React.ReactNode;
};

const EditorWrapper = (props: Props) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <Card>
          <CardHeader title="Trình soạn thảo" />
          <Divider />
          <CardContent>{props.editor}</CardContent>
        </Card>
      </div>
      {props.preview && (
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader title="Xem trước" />
            <Divider />
            <CardContent>{props.preview}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditorWrapper;


