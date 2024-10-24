import { View, Text, Linking } from 'react-native'
import React from 'react'
import { theme } from '@/assets/css/style';
import { Button } from 'react-native-paper';

interface BtnPickFileProps {
  fileKey: string;
  label: string;
  fileUrls?: { [key: string]: string };
  selectedFiles: any;
  pickFile: (fileKey: string) => void;
}

export default function BtnPickFile({fileKey, label, fileUrls, selectedFiles, pickFile}: BtnPickFileProps) {
  
  return (
    <View style={styles.input} >
      <Text style={styles.label}>{label.toUpperCase()}</Text>

      {fileUrls && (
        fileUrls[fileKey] ? (
          <Text
            style={styles.fileLink}
            onPress={() => {
              // Abre el archivo en el navegador o en una vista web
              Linking.openURL(fileUrls[fileKey]);
            }}
          >
            Ver archivo actual
          </Text>
        ) : (
          <Text style={styles.fileName}>No hay archivo actual.</Text>
        )
      )}

      <Button mode="contained" onPress={() => pickFile(fileKey)} style={styles.fileButton}>
        Seleccionar Archivo
      </Button>
      <Text style={styles.fileName}>
        {selectedFiles[fileKey]?.name || "No se ha seleccionado ningún archivo."}
      </Text>
    </View>
  )
}

const styles = {
  input: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  fileButton: {
    marginTop: 10,
  },
  fileName: {
    marginTop: 5,
    color: theme.colors.gray,
  },
  fileLink: {
    color: 'blue',
    textDecorationLine: 'underline' as 'underline',
    marginBottom: 5,
  },
}