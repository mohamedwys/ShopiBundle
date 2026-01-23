export interface Transaction {
  orderId: string;
  items: string[];
  timestamp: Date;
}

export interface ItemSet {
  items: string[];
  support: number;
  count: number;
}

export interface AssociationRule {
  antecedent: string[];
  consequent: string[];
  support: number;
  confidence: number;
  lift: number;
}

export interface FBTSuggestion {
  productId: string;
  bundledProducts: string[];
  support: number;
  confidence: number;
  lift: number;
}

export class AprioriAlgorithm {
  private minSupport: number;
  private minConfidence: number;
  private minLift: number;
  private transactions: Transaction[];
  private totalTransactions: number;

  constructor(
    transactions: Transaction[],
    minSupport: number = 0.01,
    minConfidence: number = 0.3,
    minLift: number = 1.0
  ) {
    this.transactions = transactions;
    this.totalTransactions = transactions.length;
    this.minSupport = minSupport;
    this.minConfidence = minConfidence;
    this.minLift = minLift;
  }

  private getItemCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const transaction of this.transactions) {
      for (const item of transaction.items) {
        counts.set(item, (counts.get(item) || 0) + 1);
      }
    }
    return counts;
  }

  private calculateSupport(items: string[]): number {
    let count = 0;
    for (const transaction of this.transactions) {
      if (items.every((item) => transaction.items.includes(item))) {
        count++;
      }
    }
    return count / this.totalTransactions;
  }

  private generateCandidates(
    frequentItemSets: ItemSet[],
    k: number
  ): string[][] {
    const candidates: string[][] = [];
    const items = frequentItemSets.map((set) => set.items).flat();
    const uniqueItems = Array.from(new Set(items)).sort();

    if (k === 1) {
      return uniqueItems.map((item) => [item]);
    }

    for (let i = 0; i < frequentItemSets.length; i++) {
      for (let j = i + 1; j < frequentItemSets.length; j++) {
        const set1 = frequentItemSets[i].items.slice().sort();
        const set2 = frequentItemSets[j].items.slice().sort();

        const prefix1 = set1.slice(0, k - 2);
        const prefix2 = set2.slice(0, k - 2);

        if (JSON.stringify(prefix1) === JSON.stringify(prefix2)) {
          const candidate = Array.from(
            new Set([...set1, ...set2])
          ).sort();
          if (candidate.length === k) {
            candidates.push(candidate);
          }
        }
      }
    }

    return Array.from(
      new Set(candidates.map((c) => JSON.stringify(c)))
    ).map((c) => JSON.parse(c));
  }

  private findFrequentItemSets(k: number, previousSets: ItemSet[]): ItemSet[] {
    const candidates =
      k === 1
        ? this.generateCandidates([], 1)
        : this.generateCandidates(previousSets, k);
    const frequentSets: ItemSet[] = [];

    for (const candidate of candidates) {
      let count = 0;
      for (const transaction of this.transactions) {
        if (candidate.every((item) => transaction.items.includes(item))) {
          count++;
        }
      }

      const support = count / this.totalTransactions;
      if (support >= this.minSupport) {
        frequentSets.push({
          items: candidate,
          support,
          count,
        });
      }
    }

    return frequentSets;
  }

  public generateFrequentItemSets(): ItemSet[] {
    const allFrequentSets: ItemSet[] = [];
    let k = 1;
    let previousSets: ItemSet[] = [];

    while (true) {
      const frequentSets = this.findFrequentItemSets(k, previousSets);
      if (frequentSets.length === 0) break;

      allFrequentSets.push(...frequentSets);
      previousSets = frequentSets;
      k++;

      if (k > 10) break;
    }

    return allFrequentSets;
  }

  public generateAssociationRules(
    frequentItemSets: ItemSet[]
  ): AssociationRule[] {
    const rules: AssociationRule[] = [];

    const itemSetsMap = new Map<string, ItemSet>();
    for (const itemSet of frequentItemSets) {
      itemSetsMap.set(JSON.stringify(itemSet.items.sort()), itemSet);
    }

    for (const itemSet of frequentItemSets) {
      if (itemSet.items.length < 2) continue;

      const subsets = this.generateSubsets(itemSet.items);
      for (const antecedent of subsets) {
        if (
          antecedent.length === 0 ||
          antecedent.length === itemSet.items.length
        )
          continue;

        const consequent = itemSet.items.filter(
          (item) => !antecedent.includes(item)
        );

        const antecedentKey = JSON.stringify(antecedent.sort());
        const antecedentSet = itemSetsMap.get(antecedentKey);

        if (!antecedentSet) continue;

        const confidence = itemSet.support / antecedentSet.support;

        const consequentSupport = this.calculateSupport(consequent);
        const lift =
          consequentSupport > 0 ? confidence / consequentSupport : 0;

        if (confidence >= this.minConfidence && lift >= this.minLift) {
          rules.push({
            antecedent,
            consequent,
            support: itemSet.support,
            confidence,
            lift,
          });
        }
      }
    }

    return rules;
  }

  private generateSubsets(items: string[]): string[][] {
    const subsets: string[][] = [];
    const n = items.length;
    const total = Math.pow(2, n);

    for (let i = 1; i < total - 1; i++) {
      const subset: string[] = [];
      for (let j = 0; j < n; j++) {
        if (i & (1 << j)) {
          subset.push(items[j]);
        }
      }
      subsets.push(subset);
    }

    return subsets;
  }

  public generateFBTSuggestions(maxPerProduct: number = 3): FBTSuggestion[] {
    const frequentItemSets = this.generateFrequentItemSets();
    const rules = this.generateAssociationRules(frequentItemSets);

    const suggestionsByProduct = new Map<string, FBTSuggestion[]>();

    for (const rule of rules) {
      if (rule.antecedent.length === 1) {
        const productId = rule.antecedent[0];
        if (!suggestionsByProduct.has(productId)) {
          suggestionsByProduct.set(productId, []);
        }

        suggestionsByProduct.get(productId)!.push({
          productId,
          bundledProducts: rule.consequent,
          support: rule.support,
          confidence: rule.confidence,
          lift: rule.lift,
        });
      }
    }

    const allSuggestions: FBTSuggestion[] = [];
    for (const [productId, suggestions] of suggestionsByProduct) {
      const topSuggestions = suggestions
        .sort((a, b) => {
          if (b.confidence !== a.confidence)
            return b.confidence - a.confidence;
          if (b.lift !== a.lift) return b.lift - a.lift;
          return b.support - a.support;
        })
        .slice(0, maxPerProduct);

      allSuggestions.push(...topSuggestions);
    }

    return allSuggestions;
  }
}
