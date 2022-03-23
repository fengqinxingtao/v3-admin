import http from '@/utils/http';
import { message as Message } from 'ant-design-vue';

interface DictBase {
  stateProp?: string;
  system: string;
  dictKey: string;
}

const DICT_MAP: DictBase[] = [
  {
    system: 'BREED',
    dictKey: 'CATTLE_BREED',
  },
  {
    system: 'BREED',
    dictKey: 'CATTLE_GENDER',
  },
  {
    system: 'DEFAULT',
    dictKey: 'CATTLE_SUPPLIER',
  },
  {
    system: 'DEFAULT',
    dictKey: 'IOT_PRODUCT_TYPE',
  },
];

DICT_MAP.map((d) => {
  d.stateProp = d.dictKey.toLowerCase().replace(/_(\w)/g, function (_all, letter) {
    return letter.toUpperCase();
  });
});

const state = {
  inited: false,
};
DICT_MAP.map((dict) => {
  state[dict.stateProp!] = [];
});

const mutations = {
  setInited: (state) => {
    state.inited = true;
  },
};
DICT_MAP.map((dict) => {
  mutations['set' + dict.stateProp!.replace(/^\S/, (s) => s.toUpperCase())] = (state, list) => {
    state[dict.stateProp!] = list;
  };
});

const getters = {
  inited: (state) => state.inited,
};
DICT_MAP.map((dict) => {
  getters[dict.stateProp!] = (state) => state[dict.stateProp!];
});

const actions = {
  getDictData({ commit }) {
    return new Promise((resolve, reject) => {
      http
        .post('/dicApi/getQuery', {
          param: { BREED: [] },
        })
        .then((res) => {
          const empty: string[] = [];
          DICT_MAP.forEach((dict) => {
            const item = res.data[dict.system][dict.dictKey];
            if (item) {
              commit(
                'set' + dict.stateProp!.replace(/^\S/, (s) => s.toUpperCase()),
                item.map((e) => {
                  return {
                    id: e.id,
                    value: e.dictKey,
                    label: e.dictValue,
                  };
                }),
              );
            } else {
              empty.push(dict.dictKey);
            }
          });
          commit('setInited');
          if (empty.length) {
            const info = empty.join('、') + '数据字典为空';
            console.error(info);
            Message.error(info);
          }
          resolve(null);
        })
        .catch((err) => {
          reject(err);
          Message.error('获取数据字典异常');
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
