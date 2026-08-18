import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme as Theme } from '@arli/tokens';
import type { CustomerDictionary } from '@arli/i18n';
import type { Listing } from '@arli/contracts';

interface TryOnProps {
  item: Listing | null;
  t: CustomerDictionary;
  lang: 'en' | 'hi';
  onBack: () => void;
}

/**
 * AI try-on.
 *
 * The camera, permission flow and capture are real. The garment rendering is
 * NOT — `requestTryOn` is the single seam where an inference service plugs in,
 * and until one exists this screen says so plainly rather than faking a result.
 * See docs/ARLI-Feature-Inventory.xlsx, "AI try-on".
 */
export const TryOn: React.FC<TryOnProps> = ({ item, t, onBack }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const capture = async () => {
    if (!cameraRef.current) return;
    setWorking(true);
    try {
      const shot = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      if (shot?.uri) setPhotoUri(shot.uri);
    } finally {
      setWorking(false);
    }
  };

  // --- permission gates -----------------------------------------------------
  if (!permission) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator color={Theme.colorPrimary} />
      </View>
    );
  }

  if (!permission.granted) {
    // canAskAgain false means the OS dialog will not appear again, so the only
    // useful action is opening Settings.
    const blocked = !permission.canAskAgain;
    return (
      <View style={styles.centre}>
        <Text style={styles.gateTitle}>{t.tryOnTitle}</Text>
        <Text style={styles.gateBody}>{blocked ? t.camBlocked : t.camWhy}</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => (blocked ? Linking.openSettings() : requestPermission())}
        >
          <Text style={styles.primaryBtnText}>
            {blocked ? t.openSettings : t.allowCamera}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.linkBtn}>
          <Text style={styles.linkText}>{t.backToExplore}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- captured: what we can and cannot do with it --------------------------
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
        <View style={styles.panel}>
          <Text style={styles.gateTitle}>{item?.name.en ?? t.tryOnTitle}</Text>
          <Text style={styles.notice}>{t.tryOnUnavailable}</Text>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPhotoUri(null)}>
            <Text style={styles.secondaryBtnText}>{t.retake}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} style={styles.linkBtn}>
            <Text style={styles.linkText}>{t.backToExplore}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- live camera ----------------------------------------------------------
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />
      <View style={styles.panel}>
        <Text style={styles.hint}>{t.tryOnHint}</Text>
        <TouchableOpacity style={styles.shutter} onPress={capture} disabled={working}>
          {working
            ? <ActivityIndicator color={Theme.colorCream} />
            : <Text style={styles.shutterText}>{t.capture}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.linkBtn}>
          <Text style={styles.linkText}>{t.backToExplore}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colorInk },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: Theme.bgPrimary },
  camera: { flex: 1 },
  preview: { flex: 1 },
  panel: { padding: 20, backgroundColor: Theme.bgPrimary, gap: 12 },
  gateTitle: { fontSize: 20, fontFamily: Theme.fontSerif, color: Theme.textPrimary, textAlign: 'center' },
  gateBody: { fontSize: 14, color: Theme.textSecondary, textAlign: 'center', marginVertical: 12, lineHeight: 20 },
  hint: { fontSize: 13, color: Theme.textMuted, textAlign: 'center' },
  notice: {
    fontSize: 13, color: Theme.colorWarningText, backgroundColor: Theme.colorWarningBg,
    padding: 12, borderRadius: 10, textAlign: 'center', lineHeight: 19,
  },
  primaryBtn: { backgroundColor: Theme.colorPrimary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, minHeight: 48, justifyContent: 'center' },
  primaryBtnText: { color: Theme.colorCream, fontFamily: Theme.fontSansBold, fontSize: 15 },
  secondaryBtn: { borderWidth: 1.5, borderColor: Theme.borderColor, paddingVertical: 13, borderRadius: 12, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  secondaryBtnText: { color: Theme.colorPrimary, fontFamily: Theme.fontSansBold, fontSize: 14 },
  shutter: { backgroundColor: Theme.colorAccent, paddingVertical: 15, borderRadius: 999, alignItems: 'center', minHeight: 52, justifyContent: 'center' },
  shutterText: { color: '#fff', fontFamily: Theme.fontSansBold, fontSize: 15 },
  linkBtn: { alignItems: 'center', paddingVertical: 10, minHeight: 44, justifyContent: 'center' },
  linkText: { color: Theme.textMuted, fontSize: 13, fontFamily: Theme.fontSansSemiBold },
});
