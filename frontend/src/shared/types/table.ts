export interface HeadCellsProps {
    id: string,
    label: string,
    numeric?: boolean,
    width?: number,
    disablePadding?: boolean ,
}

export interface EnhancedTableHeadProps { 
    onSelectAllClick: (value: React.ChangeEvent<HTMLInputElement>) => void, 
    headCells: HeadCellsProps[],
    multiple?: boolean,
    numSelected: number, 
    rowCount: number,
    order?:string,
    orderBy?:string
}