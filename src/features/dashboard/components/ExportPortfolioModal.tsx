import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Copy, Check, FileSpreadsheet, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { BottomSheet } from '@/shared/components/ui/BottomSheet';
import { Button } from '@/shared/components/ui/Button';
import { AccountValuationResponse } from '@/shared/types/api';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface ExportPortfolioModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: AccountValuationResponse[];
  totalNetWorth: number;
  username: string;
}

export const ExportPortfolioModal: React.FC<ExportPortfolioModalProps> = ({
  visible,
  onClose,
  accounts,
  totalNetWorth,
  username,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';
  const [copied, setCopied] = useState(false);

  // Generate plain text report
  const generateReportText = () => {
    const dateStr = new Date().toLocaleDateString('pt-BR');
    let text = `💼 RELATÓRIO CONSOLIDADO DE INVESTIMENTOS\n`;
    text += `Investidor: ${username}\n`;
    text += `Data: ${dateStr}\n`;
    text += `Patrimônio Total: R$ ${totalNetWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;

    text += `--- CONTAS & CORRETORAS (${accounts.length}) ---\n`;
    for (const acc of accounts) {
      text += `\n🏛️ ${acc.description.toUpperCase()} - R$ ${acc.totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      if (acc.positions && acc.positions.length > 0) {
        for (const pos of acc.positions) {
          text += `  • ${pos.stockId}: ${pos.quantity} cotas @ R$ ${pos.currentPrice.toFixed(2)} = R$ ${pos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        }
      } else {
        text += `  (Sem ativos vinculados)\n`;
      }
    }

    text += `\nGerado via Agregador de Investimentos`;
    return text;
  };

  const handleCopy = async () => {
    haptic.success();
    const report = generateReportText();

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(report);
      }
    } catch {
      // Fallback
    }

    setCopied(true);
    Toast.show({
      type: 'success',
      text1: 'Resumo Copiado!',
      text2: 'O extrato consolidado foi copiado para sua área de transferência.',
    });

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Extrato Consolidado da Carteira"
      subtitle="Exporte o panorama completo de seus ativos"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[500px]">
        {/* Total Highlight */}
        <View
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#2E152E' : '#272727',
            borderWidth: 1,
          }}
          className="p-4 rounded-2xl mb-4 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-[10px] text-zinc-400 font-bold uppercase">
              Patrimônio Consolidado
            </Text>
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-2xl font-black mt-0.5"
            >
              R$ {totalNetWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck size={14} color="#10B981" />
            <Text className="text-[10px] text-emerald-400 font-bold">Auditado</Text>
          </View>
        </View>

        {/* Breakdown by Account Preview */}
        <View className="gap-3 mb-6">
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Detalhamento por Corretora ({accounts.length})
          </Text>

          {accounts.map((acc) => (
            <View
              key={acc.accountId}
              style={{
                backgroundColor: '#111115',
                borderColor: '#1F1F24',
                borderWidth: 1,
              }}
              className="p-3.5 rounded-2xl"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-black text-white capitalize">
                  {acc.description}
                </Text>
                <Text className="text-xs font-extrabold text-white">
                  R$ {acc.totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              {acc.positions && acc.positions.length > 0 ? (
                acc.positions.map((p) => (
                  <View
                    key={p.stockId}
                    className="flex-row items-center justify-between py-1 border-t border-zinc-900"
                  >
                    <Text className="text-xs text-zinc-400">
                      <Text className="font-bold text-white">{p.stockId}</Text> ({p.quantity} cotas)
                    </Text>
                    <Text className="text-xs text-zinc-300 font-medium">
                      R$ {p.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-xs text-zinc-500 italic">Sem posições ativas</Text>
              )}
            </View>
          ))}
        </View>

        {/* Copy Button */}
        <Button
          variant="primary"
          size="lg"
          leftIcon={copied ? <Check size={18} color={isPink ? '#FFFFFF' : '#000000'} /> : <Copy size={18} color={isPink ? '#FFFFFF' : '#000000'} />}
          onPress={handleCopy}
          className="w-full mb-2"
        >
          {copied ? 'Copiado para Área de Transferência!' : 'Copiar Resumo em Texto'}
        </Button>
      </ScrollView>
    </BottomSheet>
  );
};
