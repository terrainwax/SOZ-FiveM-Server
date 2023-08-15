import { Rpc } from '@public/core/decorators/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AdminPlayer } from '../../shared/admin/admin';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerMetadata } from '../../shared/player';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';

@Provider()
export class AdminMenuPlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_SET_METADATA)
    public onSetHealthMetadata(source: number, player: AdminPlayer, key: keyof PlayerMetadata, value: number) {
        this.playerService.setPlayerMetadata(player.id, key, value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STAMINA)
    public onSetStamina(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'max_stamina', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRESS_LEVEL)
    public onSetStressLevel(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'stress_level', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRENGTH)
    public onSetStrength(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'strength', value);
        this.playerService.updatePlayerMaxWeight(player.id);
    }

    @OnEvent(ServerEvent.ADMIN_SET_AIO)
    public onSetAIO(source: number, player: AdminPlayer, value: 'min' | 'max') {
        this.onSetStamina(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStressLevel(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStrength(source, player, value === 'min' ? -1000 : 1000);

        const targetPlayer = this.playerService.getPlayer(player.id);

        if (!targetPlayer) {
            return;
        }

        const nutritionValue = value === 'min' ? 0 : 25;
        const newHealthLevel = this.playerService.getIncrementedMetadata(
            targetPlayer,
            'health_level',
            value === 'min' ? -100 : 100,
            0,
            100
        );

        let maxHealth = 200;

        if (newHealthLevel < 20) {
            maxHealth = 160;
        } else if (newHealthLevel < 40) {
            maxHealth = 180;
        }

        this.playerService.setPlayerMetaDatas(player.id, {
            fiber: nutritionValue,
            sugar: nutritionValue,
            protein: nutritionValue,
            lipid: nutritionValue,
            max_health: maxHealth,
            health_level: newHealthLevel,
        });
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public async onResetSkin(source: number, target: number) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, target);
        this.notifier.notify(source, 'Le skin du joueur a été reset.');
    }

    @OnEvent(ServerEvent.ADMIN_RESET_HALLOWEEN)
    public async onResetHalloween(source: number, target: number, year: '2022', scenario: 'scenario1' | 'scenario2') {
        this.playerService.setPlayerMetadata(target, `halloween2022`, {
            ...this.playerService.getPlayer(target).metadata.halloween2022,
            [scenario]: null,
        });
        this.notifier.notify(
            source,
            `La progression du joueur ~b~Halloween ${year} (${scenario})~s~ a été réinitialisée.`,
            'info'
        );
    }

    @Rpc(RpcServerEvent.ADMIN_GET_REPUTATION)
    public getReputation(source: number, target: number) {
        return this.playerService.getPlayer(target).metadata.criminal_reputation;
    }

    @OnEvent(ServerEvent.ADMIN_RESET_CLIENT_STATE)
    public async onResetClientState(source: number, target: number) {
        this.playerStateService.resetClientState(target);

        this.notifier.notify(source, `L'état client du joueur a été réinitialisée.`, 'info');
    }
}
