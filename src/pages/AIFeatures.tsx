import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { theme as Theme } from '@arli/tokens';
import type { CustomerDictionary } from '@arli/i18n';

interface AIFeaturesProps {
  t: CustomerDictionary;
  onBrowse: () => void;
}

/**
 * Hub for AI-powered features, reached from its own nav tab (replacing the
 * old "Chat" tab — chat is now reached contextually from a listing's own
 * page instead, where it actually has a shop to talk to).
 *
 * Lists what is real today (AI Try-On) rather than a feature-flag grid of
 * things that don't exist yet. Try-On itself needs a selected listing, which
 * a nav-level tap cannot provide, so this routes into Explore to pick one —
 * see docs/ARLI-Feature-Inventory.xlsx for what "AI Try-On" does and does not
 * do yet (capture is real, garment rendering is not).
 */
export const AIFeatures: React.FC<AIFeaturesProps> = ({ t, onBrowse }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✨ {t.aiFeaturesTitle}</Text>
      <Text style={styles.intro}>{t.aiFeaturesIntro}</Text>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>📸</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{t.tryOn}</Text>
          <Text style={styles.cardDesc}>{t.aiTryOnCardDesc}</Text>
          <TouchableOpacity style={styles.cardCta} onPress={onBrowse}>
            <Text style={styles.cardCtaText}>{t.browseToTryOn}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.moreComingSoon}>{t.aiMoreComingSoon}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 110, gap: 16 },
  title: { fontSize: 24, fontFamily: Theme.fontSerif, color: Theme.textPrimary },
  intro: { fontSize: 14, color: Theme.textSecondary, marginTop: -8 },
  card: {
    flexDirection: 'row', gap: 14, backgroundColor: Theme.colorCardBg,
    borderWidth: 1, borderColor: Theme.borderColor, borderRadius: 16, padding: 16,
  },
  cardIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: Theme.bgSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardBody: { flex: 1, gap: 6 },
  cardTitle: { fontSize: 15, fontFamily: Theme.fontSansBold, color: Theme.textPrimary },
  cardDesc: { fontSize: 12.5, color: Theme.textMuted, lineHeight: 18 },
  cardCta: { marginTop: 6, alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' },
  cardCtaText: { fontSize: 13, fontFamily: Theme.fontSansBold, color: Theme.colorAccent },
  moreComingSoon: { fontSize: 12.5, color: Theme.textMuted, textAlign: 'center', marginTop: 8 },
});
