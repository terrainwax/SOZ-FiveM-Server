import { DrugSeedlingRepository } from '@private/server/resources/drug.seedling.repository';
import { DrugSellLocationRepository } from '@private/server/resources/drug.sell.location.repository';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { ClothingShop, ClothingShopCategory, ClothingShopRepositoryData } from '../../shared/shop';
import { PrismaService } from '../database/prisma.service';
import { ClothingShopRepository } from './cloth.shop.repository';
import { FuelStationRepository } from './fuel.station.repository';
import { GarageRepository } from './garage.repository';
import { GloveShopRepository } from './glove.shop.repository';
import { HousingRepository } from './housing.repository';
import { JobGradeRepository } from './job.grade.repository';
import { ObjectRepository } from './object.repository';
import { RaceRepository } from './race.repository';
import { Repository } from './repository';
import { UnderTypesShopRepository } from './under_types.shop.repository';
import { UpwChargerRepository } from './upw.charger.repository';
import { UpwStationRepository } from './upw.station.repository';
import { VehicleRepository } from './vehicle.repository';

@Provider()
export class RepositoryProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(UpwStationRepository)
    private upwStationRepository: UpwStationRepository;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(ObjectRepository)
    private objectRepository: ObjectRepository;

    @Inject(DrugSeedlingRepository)
    private drugSeedlingRepository: DrugSeedlingRepository;

    @Inject(DrugSellLocationRepository)
    private drugSellLocationRepository: DrugSellLocationRepository;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Inject(GloveShopRepository)
    private gloveShopRepository: GloveShopRepository;

    @Inject(UnderTypesShopRepository)
    private underTypesShopRepository: UnderTypesShopRepository;

    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(RaceRepository)
    private raceRepository: RaceRepository;

    private repositories: Record<string, Repository<any>> = {};

    @Once()
    public setup() {
        this.repositories['garage'] = this.garageRepository;
        this.repositories['vehicle'] = this.vehicleRepository;
        this.repositories['jobGrade'] = this.jobGradeRepository;
        this.repositories['fuelStation'] = this.fuelStationRepository;
        this.repositories['upwCharger'] = this.upwChargerRepository;
        this.repositories['upwStation'] = this.upwStationRepository;
        this.repositories['housing'] = this.housingRepository;
        this.repositories['object'] = this.objectRepository;
        this.repositories['clothingShop'] = this.clothingShopRepository;
        this.repositories['gloveShop'] = this.gloveShopRepository;
        this.repositories['underTypesShop'] = this.underTypesShopRepository;
        this.repositories['drugSeedling'] = this.drugSeedlingRepository;
        this.repositories['drugSellLocation'] = this.drugSellLocationRepository;
        this.repositories['race'] = this.raceRepository;
    }

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        for (const repositoryName of Object.keys(this.repositories)) {
            await this.repositories[repositoryName].init();
        }

        this.onceLoader.trigger(OnceStep.RepositoriesLoaded);
    }

    @Rpc(RpcServerEvent.REPOSITORY_GET_DATA)
    public async getData(source: number, repositoryName: string): Promise<any> {
        if (this.repositories[repositoryName]) {
            return await this.repositories[repositoryName].get();
        }

        return null;
    }

    public async refresh(repositoryName: string): Promise<any | null> {
        if (this.repositories[repositoryName]) {
            const data = await this.repositories[repositoryName].refresh();

            TriggerClientEvent(ClientEvent.REPOSITORY_SYNC_DATA, -1, repositoryName, data);

            return data;
        }

        return null;
    }

    @Rpc(RpcServerEvent.REPOSITORY_CLOTHING_GET_SHOP)
    public async getShopData(
        source: number,
        playerPedHash: number,
        shop: string
    ): Promise<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }> {
        const clothingData = await this.getClothingData(source, playerPedHash);

        if (!clothingData) {
            return null;
        }

        return {
            shop: clothingData.shops[shop],
            content: clothingData.categories[playerPedHash][clothingData.shops[shop].id],
        };
    }

    private async getClothingData(source: number, playerPedHash: number): Promise<ClothingShopRepositoryData> {
        if (!this.repositories['clothingShop']) {
            return null;
        }
        const shop: ClothingShopRepositoryData = await this.repositories['clothingShop'].get();

        // remove categories from another ped model
        return {
            ...shop,
            categories: Object.entries(shop.categories)
                .filter(([key]) => Number(key) === playerPedHash)
                .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}) as { [key: string]: any },
        };
    }
}
