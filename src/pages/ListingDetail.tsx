import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import type { Listing } from '@arli/contracts';
import { theme as Theme } from '@arli/tokens';

interface ListingDetailProps {
  item: Listing | null;
  t: any;
  lang: 'en' | 'hi';
  onBack: () => void;
  onAddToCart: (qty: number, attachMeas: boolean) => void;
  onChatWithShop: () => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({
  item,
  t,
  lang,
  onBack,
  onAddToCart,
  onChatWithShop,
}) => {
  if (!item) return <View style={styles.errorBoxReady}><Text>{t.noListingSelected}</Text></View>;

  const [qty, setQty] = useState(1);
  const [attachMeas, setAttachMeas] = useState(false);
  const [chest, setChest] = useState('38');
  const [waist, setWaist] = useState('32');
  const [hip, setHip] = useState('40');

  const name = item.name[lang];
  const shop = item.shop[lang];
  const desc = item.desc[lang];

  const qtyPlus = () => setQty((prev) => prev + 1);
  const qtyMinus = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← {t.backToExplore}</Text>
      </TouchableOpacity>

      {/* Large swatch display block */}
      <View style={[styles.imageSwatch, { backgroundColor: item.base }]} />

      <View style={styles.content}>
        {item.sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>{t.sponsored}</Text>
          </View>
        )}

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.shop}>{shop} · {item.pincode}</Text>
        
        <View style={styles.ratingRow}>
          <Text style={styles.ratingStars}>★ {item.rating}</Text>
          <Text style={styles.ratingCount}>({item.reviews} {t.reviewsWord})</Text>
        </View>

        <Text style={styles.desc}>{desc}</Text>

        <Text style={styles.price}>
          ₹{item.price}
          <Text style={styles.unit}>
            {item.cat === 'fabric' ? ` / ${t.qtyMeters || 'meter'}` : ` / ${t.qtyPieces || 'pcs'}`}
          </Text>
        </Text>

        {/* Quantity control */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>{item.cat === 'fabric' ? t.qtyMeters : t.qtyPieces}</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={qtyMinus} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterVal}>{qty}</Text>
            <TouchableOpacity onPress={qtyPlus} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional measurements */}
        {item.measurable && (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setAttachMeas(!attachMeas)} style={styles.checkboxRow}>
              <View style={[styles.checkbox, attachMeas && styles.checkboxActive]} />
              <Text style={styles.checkboxLabel}>📏 {t.attachMeas}</Text>
            </TouchableOpacity>
            
            {attachMeas && (
              <View style={styles.measGrid}>
                <View style={styles.measCol}>
                  <Text style={styles.measHeader}>{t.measChest}</Text>
                  <TextInput value={chest} onChangeText={setChest} keyboardType="numeric" style={styles.measInput} />
                </View>
                <View style={styles.measCol}>
                  <Text style={styles.measHeader}>{t.measWaist}</Text>
                  <TextInput value={waist} onChangeText={setWaist} keyboardType="numeric" style={styles.measInput} />
                </View>
                <View style={styles.measCol}>
                  <Text style={styles.measHeader}>Hip</Text>
                  <TextInput value={hip} onChangeText={setHip} keyboardType="numeric" style={styles.measInput} />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Action triggers */}
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={() => onAddToCart(qty, attachMeas)} style={styles.addToCartBtn}>
            <Text style={styles.addToCartBtnText}>{t.addToCart}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatWithShop} style={styles.chatBtn}>
            <Text style={styles.chatBtnText}>💬</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.payNote}>🏪 {t.payAtShop}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.bgPrimary,
    flex: 1,
  },
  errorBoxReady: {
    padding: 30,
    alignItems: 'center',
  },
  backBtn: {
    padding: 16,
  },
  backBtnText: {
    fontFamily: Theme.fontSansSemiBold,
    fontSize: 13,
    color: Theme.textMuted,
  },
  imageSwatch: {
    height: 240,
    width: '100%',
  },
  content: {
    padding: 20,
  },
  sponsoredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colorWarning,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sponsoredText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 9,
    color: Theme.textPrimary,
  },
  name: {
    fontFamily: Theme.fontSerif,
    fontSize: 30,
    color: Theme.textPrimary,
  },
  shop: {
    fontFamily: Theme.fontSansMedium,
    fontSize: 13,
    color: Theme.colorPrimary,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  ratingStars: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: '#A5732A',
  },
  ratingCount: {
    fontFamily: Theme.fontSans,
    fontSize: 12,
    color: Theme.textMuted,
  },
  desc: {
    fontFamily: Theme.fontSans,
    fontSize: 14,
    lineHeight: 20,
    color: Theme.textSecondary,
    marginVertical: 14,
  },
  price: {
    fontFamily: Theme.fontSansBold,
    fontSize: 24,
    color: Theme.colorPrimary,
    marginBottom: 16,
  },
  unit: {
    fontFamily: Theme.fontSans,
    fontSize: 14,
    color: Theme.textMuted,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  controlLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 14,
    color: Theme.textPrimary,
  },
  counter: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  counterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colorPrimary,
  },
  counterVal: {
    fontFamily: Theme.fontSansBold,
    fontSize: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: Theme.colorPrimary,
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: Theme.colorPrimary,
  },
  checkboxLabel: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: Theme.textPrimary,
  },
  measGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  measCol: {
    flex: 1,
  },
  measHeader: {
    fontFamily: Theme.fontSansBold,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Theme.textMuted,
    marginBottom: 4,
  },
  measInput: {
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 6,
    padding: 6,
    fontSize: 13,
    backgroundColor: '#FAF5EC',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Theme.colorAccent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToCartBtnText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 15,
    color: '#fff',
  },
  chatBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Theme.colorPrimary,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnText: {
    fontSize: 18,
  },
  payNote: {
    fontFamily: Theme.fontSans,
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
});
