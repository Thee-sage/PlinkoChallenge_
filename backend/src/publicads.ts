import express from 'express';
import { Ad } from './models/Ad';
import { Casino } from './models/Casino';
import { Document } from 'mongoose';

// Define interfaces for type safety
interface ICasino {
    _id: string;
    name: string;
    description: string;
    logo: string;
    website: string;
    established: number;
    ourRating: number;
    userRating: {
        averageScore: number;
        totalVotes: number;
    };
    trustIndex: string;
    categoryRatings: any[];
    payoutRatio: {
        percentage: number;
        lastUpdated: Date;
    };
    payoutSpeed: {
        averageDays: string;
        details: string;
    };
    licenses: string[];
    securityMeasures: string[];
    fairnessVerification: string[];
    paymentMethods: any[];
    currencies: string[];
    minDeposit: number;
    maxPayout: number;
    contentSections: any[];
    advantages: string[];
    disadvantages: string[];
    isActive: boolean;
    orderInListing: number;
    offer: string;
}

// Interface for lean documents (plain objects)
interface IPopulatedAdLean {
    _id: string;
    title: string;
    description: string;
    link: string;
    imageUrl?: string;
    rating: number;
    service: string;
    location: string;
    isShowInMainPage: boolean;
    percentageInHomePage: number;
    orderInCasinosPage: number;
    casino: ICasino;
}

const router = express.Router();

// Get all public ads with SLIM casino data (only fields needed for ad cards)
// This is the main endpoint hit by AdContainer on every page load — keep it fast
router.get('/', async (req, res) => {
    try {
        const ads = await Ad.find({})
            .select('title description link imageUrl rating service location isShowInMainPage percentageInHomePage orderInCasinosPage casino')
            .populate({
                path: 'casino',
                select: 'name logo website ourRating trustIndex offer isActive'
            })
            .lean<IPopulatedAdLean[]>();

        if (!ads || ads.length === 0) {
            return res.status(404).json({ message: 'No ads found.' });
        }

        // Allow browsers/CDNs to cache for 5 minutes
        res.set('Cache-Control', 'public, max-age=300');
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error fetching public ads:', error);
        res.status(500).json({ message: 'Error fetching ads', error });
    }
});

// Get main content ads for public view with slim casino data
router.get('/main-content', async (req, res) => {
    try {
        // Get all main content ads
        const ads = await Ad.find({
            location: 'MainContent',
            isShowInMainPage: true
        })
        .select('title description link imageUrl rating service location isShowInMainPage percentageInHomePage orderInCasinosPage casino')
        .populate({
            path: 'casino',
            match: { isActive: true },
            select: 'name logo website ourRating trustIndex offer isActive'
        })
        .sort({ percentageInHomePage: -1 })
        .lean<IPopulatedAdLean[]>();

        if (!ads || ads.length === 0) {
            return res.status(404).json({ 
                message: 'No main content ads found.',
                debug: {
                    totalAds: ads.length
                }
            });
        }

        // Allow browsers/CDNs to cache for 5 minutes
        res.set('Cache-Control', 'public, max-age=300');
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error fetching main content ads:', error);
        res.status(500).json({ 
            message: 'Error fetching main content ads', 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get public ads by location with complete casino information
router.get('/location/:location', async (req, res) => {
    try {
        const ads = await Ad.find({ location: req.params.location })
            .select('title description link imageUrl rating service location isShowInMainPage percentageInHomePage orderInCasinosPage casino')
            .populate({
                path: 'casino',
                select: 'name logo website ourRating trustIndex offer isActive orderInListing'
            })
            .lean<IPopulatedAdLean[]>();

        if (!ads || ads.length === 0) {
            return res.status(404).json({ message: 'No ads found for this location' });
        }

        res.set('Cache-Control', 'public, max-age=300');
        res.status(200).json(ads);
    } catch (error) {
        console.error('Error fetching public ads by location:', error);
        res.status(500).json({ message: 'Error fetching ads by location', error });
    }
});

// Get public ad by ID with complete casino information (used for detail views)
router.get('/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id)
            .select('title description link imageUrl rating service location isShowInMainPage percentageInHomePage orderInCasinosPage casino')
            .populate({
                path: 'casino',
                select: 'name description logo website established ourRating userRating trustIndex ' +
                       'categoryRatings payoutRatio payoutSpeed licenses securityMeasures fairnessVerification ' +
                       'paymentMethods currencies minDeposit maxPayout contentSections advantages disadvantages ' +
                       'isActive orderInListing'
            })
            .lean<IPopulatedAdLean>();

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.set('Cache-Control', 'public, max-age=300');
        res.status(200).json(ad);
    } catch (error) {
        console.error('Error fetching public ad:', error);
        res.status(500).json({ message: 'Error fetching ad', error });
    }
});

export default router;