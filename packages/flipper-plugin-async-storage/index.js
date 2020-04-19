import { Text, Panel, ManagedDataInspector, createTablePlugin } from 'flipper';

function renderSidebar(row) {
    return (
        <Panel floating={false} heading={'Data'}>
            <ManagedDataInspector data={row} expandRoot={true} />
        </Panel>
    );
}

const columns = {
    key: {
        value: 'Key',
    },
    value: {
        value: 'Value',
    },
};

const columnSizes = {
    key: '20%',
    value: 'flex',
};

function buildRow(row) {
    return {
        columns: {
            key: {
                value: <Text>{row.key}</Text>,
                filterValue: row.key,
            },
            value: {
                value: <Text>{JSON.stringify(row.value)}</Text>,
                filterValue: JSON.stringify(row.value),
            },
        },
        key: row.id,
        copyText: JSON.stringify(row),
        filterValue: `${row.key} ${JSON.stringify(row.value)}`,
    };
}

export default createTablePlugin({
    method: 'newElement',
    columns,
    columnSizes,
    renderSidebar,
    buildRow,
});
