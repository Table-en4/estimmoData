import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Transaction } from '../models/Transaction';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'ValeursFoncieres-2025-S1.txt');

export interface SearchCriteria {
    codePostal?: string;
    ville?: string;
    minPrix?: number;
    maxPrix?: number;
    minSurface?: number;
    minPieces?: number;
    typeLocal?: string; 
}

export class DataService {
  private transactions: Transaction[] = [];
  private isLoaded: boolean = false;

  public async loadData(): Promise<void> {
    if (this.isLoaded) return;

    console.log(`--- DÉBUT DU CHARGEMENT ---`);
    console.log(`Je cherche le fichier ici : ${DATA_FILE_PATH}`);

    if (!fs.existsSync(DATA_FILE_PATH)) {
        console.error("❌ ERREUR : Le fichier n'existe pas ! Vérifiez le dossier 'data' à la racine.");
        return;
    }

    return new Promise((resolve, reject) => {
      const results: Transaction[] = [];
      let rowCount = 0;

      fs.createReadStream(DATA_FILE_PATH)
        .pipe(csv({ 
            separator: '|', 
            mapHeaders: ({ header }) => header.trim() 
        }))
        .on('data', (data) => {
          rowCount++;
          if (data['Valeur fonciere']) {
             results.push(data);
          }
        })
        .on('end', () => {
          this.transactions = results;
          this.isLoaded = true;
          console.log(`✅ TERMINÉ : ${results.length} transactions chargées (sur ${rowCount} lignes).`);
          resolve();
        })
        .on('error', (err) => {
            console.error("❌ Erreur de lecture CSV:", err);
            reject(err);
        });
    });
  }

  public getAll(): Transaction[] {
    return this.transactions;
  }

  public getByPostalCode(codePostal: string): Transaction[] {
    return this.transactions.filter(t => t['Code postal'] === codePostal);
  }
  
  public getByCity(city: string): Transaction[] {
      return this.transactions.filter(t => t['Commune'] && t['Commune'].toUpperCase() === city.toUpperCase());
  }

  public search(criteria: SearchCriteria): Transaction[] {
      return this.transactions.filter(t => {
          let matches = true;

          if (criteria.ville) {
              const villeData = t['Commune']?.toUpperCase() || '';
              const villeRecherche = criteria.ville.toUpperCase();
              
              if (!villeData.startsWith(villeRecherche)) {
                  matches = false; 
              }
          }
          
          if (!matches) return false;
          if (criteria.codePostal) {
              if (t['Code postal'] !== criteria.codePostal) return false;
          }
          if (criteria.typeLocal) {
              if (!t['Type local']?.toLowerCase().includes(criteria.typeLocal.toLowerCase())) return false;
          }
          if (criteria.minPrix || criteria.maxPrix) {
              const prixString = t['Valeur fonciere']?.replace(',', '.');
              const prix = parseFloat(prixString);
              if (isNaN(prix)) return false;
              if (criteria.minPrix && prix < criteria.minPrix) return false;
              if (criteria.maxPrix && prix > criteria.maxPrix) return false;
          }
          if (criteria.minSurface) {
              const surface = parseInt(t['Surface reelle bati'] || '0');
              if (surface < criteria.minSurface) return false;
          }
           if (criteria.minPieces) {
              const pieces = parseInt(t['Nombre pieces principales'] || '0');
              if (pieces < criteria.minPieces) return false;
          }
          return true;
      });
  }
}

export const dataService = new DataService();