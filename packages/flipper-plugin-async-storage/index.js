import {
    Text,
    Panel,
    ManagedDataInspector,
    FlipperPlugin,
    ManagedTable,
    DetailSidebar,
} from 'flipper';

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

class AsyncStorage extends FlipperPlugin {
    constructor(props) {
        super(props);
    }
    state = {
        selectedElementId: '',
    };

    static defaultPersistedState = {
        data: [],
    };

    static persistedStateReducer(persistedState, method, payload) {
        switch (method) {
            case 'newElement': {
                return {
                    data: this.addNewElement(persistedState.data, payload),
                };
            }
        }
    }

    static addNewElement = (data, newElement) => {
        const index = data.findIndex(
            (current) => current.key === newElement.key
        );
        if (index === -1) {
            data.push(newElement);
            return data;
        }
        data[index] = newElement;
        return data;
    };

    onRowHighlighted = ([key]) => this.setState({ selectedElementId: key });

    buildRows() {
        const { data } = this.props.persistedState;
        return data.map((row) => {
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
        });
    }

    render() {
        const { data } = this.props.persistedState;
        return (
            <>
                <ManagedTable
                    floating={false}
                    multiline={true}
                    columns={columns}
                    stickyBottom={true}
                    multiHighlight={false}
                    rows={this.buildRows()}
                    columnSizes={columnSizes}
                    onRowHighlighted={this.onRowHighlighted}
                />
                <DetailSidebar>
                    <Panel floating={false} heading={'Data'}>
                        <ManagedDataInspector data={data} expandRoot={true} />
                    </Panel>
                </DetailSidebar>
            </>
        );
    }
}

export default AsyncStorage;
