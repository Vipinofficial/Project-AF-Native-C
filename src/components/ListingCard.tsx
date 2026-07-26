import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Listing } from '../types';
import { Theme } from '../theme';

interface ListingCardProps {
  item: Listing;
  lang: 'en' | 'hi';
  t: any;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, lang, t, onClick }) => {
  const name = item.name[lang];
  const shop = item.shop[lang];

  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.85} style={styles.card}>
      {/* Colored Swatch View */}
      <View style={[styles.swatch, { backgroundColor: item.base }]} />

      <View style={styles.details}>
        {item.sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>{t.sponsored}</Text>
          </View>
        )}

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.shop}>{shop} · {item.pincode}</Text>
        
        <View style={styles.footerRow}>
          <Text style={styles.price}>
            ₹{item.price}
            <Text style={styles.unit}>
              {item.cat === 'fabric' ? ` / ${t.qtyMeters || 'meter'}` : ` / ${t.qtyPieces || 'pcs'}`}
            </Text>
          </Text>

          <Text style={styles.rating}>★ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    flexDirection: 'column',
  },
  swatch: {
    height: 120,
    width: '100%',
  },
  details: {
    padding: 12,
  },
  sponsoredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colorWarning,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  sponsoredText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 9,
    color: Theme.textPrimary,
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: Theme.fontSansBold,
    fontSize: 14,
    color: Theme.textPrimary,
  },
  shop: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontFamily: Theme.fontSansBold,
    fontSize: 15,
    color: Theme.colorPrimary,
  },
  unit: {
    fontFamily: Theme.fontSans,
    fontSize: 10,
    color: Theme.textMuted,
  },
  rating: {
    fontFamily: Theme.fontSansBold,
    fontSize: 12,
    color: '#A5732A',
  },
});
