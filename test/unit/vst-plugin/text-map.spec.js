/**
 * Created by zhaoxiaoqiang on 2017/4/12.
 */
import Vue from 'vue';
import app from '../../../src/vst-plugin/text-map';

describe('test text-map component', () => {
    it('dd', () => {
        let vm = new Vue(app).$mount();
        expect(vm.title.toEqual(''));
    });
});
