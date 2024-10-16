import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { Alert } from 'react-native';

export function useFilePicker() {
  const [selectedFiles, setSelectedFiles] = useState<any>({});

  const pickFile = async (fileKey: string) => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFiles((prev: any) => ({ ...prev, [fileKey]: file[0] }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("File selection cancelled");
      } else {
        Alert.alert("Error", "Error selecting file");
      }
    }
  };

  return { selectedFiles, pickFile };
}
