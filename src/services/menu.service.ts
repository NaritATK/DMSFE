import apiClient from '@/libs/axios';

export interface Menu {
    menuId: string;
    label: string;
    icon?: string;
    href?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
    requiredRole?: string;
    children?: Menu[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateMenuDto {
    label: string;
    icon?: string;
    href?: string;
    parentId?: string;
    order?: number;
    isActive?: boolean;
    requiredRole?: string;
}

export type UpdateMenuDto = Partial<CreateMenuDto>

export interface ReorderMenuDto {
    menus: { id: string; order: number }[];
}

class MenuService {
    async getMenus(): Promise<Menu[]> {
        const response = await apiClient.get(`/menus`);

        
return response.data;
    }

    async createMenu(data: CreateMenuDto): Promise<Menu> {
        const response = await apiClient.post(`/menus`, data);

        
return response.data;
    }

    async updateMenu(id: string, data: UpdateMenuDto): Promise<Menu> {
        const response = await apiClient.patch(`/menus/${id}`, data);

        
return response.data;
    }

    async deleteMenu(id: string): Promise<void> {
        await apiClient.delete(`/menus/${id}`);
    }

    async reorderMenus(data: ReorderMenuDto): Promise<void> {
        await apiClient.patch(`/menus`, data);
    }
}

export const menuService = new MenuService();
