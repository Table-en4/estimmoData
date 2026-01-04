import { Router, Request, Response } from 'express';
import { dataService, SearchCriteria } from '../services/DataService';

const router = Router();

// Route de recherche avancée (ex: /search?ville=PARIS&minPrix=200000)
router.get('/search', (req: Request, res: Response) => {
    const criteria: SearchCriteria = {};

    if (req.query.ville) criteria.ville = req.query.ville as string;
    if (req.query.cp) criteria.codePostal = req.query.cp as string;
    if (req.query.type) criteria.typeLocal = req.query.type as string;
    
    if (req.query.minPrix) criteria.minPrix = parseFloat(req.query.minPrix as string);
    if (req.query.maxPrix) criteria.maxPrix = parseFloat(req.query.maxPrix as string);
    if (req.query.minSurface) criteria.minSurface = parseInt(req.query.minSurface as string);
    if (req.query.minPieces) criteria.minPieces = parseInt(req.query.minPieces as string);

    const results = dataService.search(criteria);
    
    res.json({
        total: results.length,
        results: results.slice(0, 100)
    });
});

router.get('/', (req: Request, res: Response) => {
  const transactions = dataService.getAll();
  res.json(transactions.slice(0, 100));
});

router.get('/cp/:codePostal', (req: Request, res: Response) => {
  const cp = req.params.codePostal;
  const results = dataService.getByPostalCode(cp);
  res.json(results);
});

router.get('/ville/:ville', (req: Request, res: Response) => {
  const ville = req.params.ville;
  const results = dataService.getByCity(ville);
  res.json(results);
});

export default router;