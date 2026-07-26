import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme';

interface OfferCardProps {
  mark: string;
  title: string;
  sub: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({ mark, title, sub }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.markText}>{mark}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subText}>{sub}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(250, 245, 236, 0.08)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(233, 162, 59, 0.55)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  markText: {
    fontFamily: Theme.fontSerif,
    fontSize: 20,
    color: Theme.colorWarning,
    marginRight: 12,
  },
  titleText: {
    fontFamily: Theme.fontSansBold,
    fontSize: 13,
    color: '#FAF5EC',
  },
  subText: {
    fontFamily: Theme.fontSans,
    fontSize: 10,
    color: '#B8C0D6',
    marginTop: 2,
  },
});
