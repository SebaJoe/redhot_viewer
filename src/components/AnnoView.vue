<template>
    <div class="container">
        <div class="row mt-2">
            <div class="col">
                <h1>RedHOT Annotation Interface</h1>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-3">
                <input class="form-control" type="file" ref="doc" @change="readfile()"/>
            </div>
            <div class="col">
                <button class="btn btn-light float-right" style="float:right;" @click="dec_findex()" :disabled="disable_movement">
                    <i class="bi bi-chevron-left"></i>
                </button>
            </div>
            <div class="col d-flex justify-content-center">
                <h4><input style="width:45px;" :value="findex + 1" @input="move_to_target($event)"> / {{ parsed_file.length }}</h4>
            </div>
            <div class="col">
                <button class="btn btn-light float-left" style="float:left;" @click="inc_findex()" :disabled="disable_movement">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="col-3">
                <button class="btn btn-outline-secondary float-right" style="float:right;" @click="download_parsed_file()">
                    Download
                </button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col">
                <div class="card" style="background-color:#ffe4e3;">
                    <div class="card-header text-muted">
                        <div class="row">
                            <div class="col d-flex align-items-center">
                                RedHOT Post
                            </div>
                            <div class="col">
                                <div class="float-right" style="background-color: #92de81; border-radius: 20px; padding:0.375rem 0.75rem; display: inline-flex; float:right;">
                                    r/{{ sub_name }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <span style="white-space: pre-line;" v-html="redhot_post" ref="postcard">
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col">
                <div class="card" style="background-color:#F0F1FF;">
                    <div class="card-header text-muted">
                        <div class="row">
                            <div class="col d-flex align-items-center">
                                Selected Claim
                            </div>
                            <div class="col float-right" style="float:right;">
                                <div class="float-right" style="border-radius: 20px; background-color:#F0F1FF; padding:0.375rem 0.75rem; display: inline-flex; float:right;">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="nonverifiable" @click="toggle_verifiablity()" :disabled="verify">
                                        <label class="form-check-label" for="flexCheckDefault">
                                            <i>Not RCT-Verifiable</i>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row border-bottom">
                            <div class="col pb-3" :class="{ 'col-9': verify }">
                                <div class="row pb-2">
                                    <div class="col-2">
                                        <b>
                                            Original Claim: 
                                        </b>
                                    </div>
                                    <div class="col">
                                        <span style="white-space: pre-line;">
                                            {{ selected_claim }}
                                        </span>
                                    </div>
                                </div>
                                <div class="row" v-if="has_rewrite">
                                    <div class="col-2">
                                        <b>
                                            Population: 
                                        </b>
                                    </div>
                                    <div class="col">
                                        <div class="highBlue" style="border-radius: 20px; padding:0.375rem 0.75rem; display:inline-block;">
                                            <input type="text" v-if="rewritten_claim_dict.pop_edit" v-autowidth :placeholder="rewritten_claim_dict.population" v-model="rewritten_claim_dict.population" v-on:keyup.enter="rewritten_claim_dict.pop_edit = false" :disabled="verify"> 
                                            <b @dblclick="rewritten_claim_dict.pop_edit = true" v-else>{{rewritten_claim_dict.population}}</b>
                                        </div>
                                    </div>
                                </div>
                                <div class="row pt-1" v-if="has_rewrite">
                                    <div class="col-2">
                                        <b>
                                            Intervention: 
                                        </b>
                                    </div>
                                    <div class="col">
                                        <div class="highInter" style="border-radius: 20px; padding:0.375rem 0.75rem; display:inline-block;">
                                            <input type="text" v-if="rewritten_claim_dict.inter_edit" v-autowidth :placeholder="rewritten_claim_dict.intervention" v-model="rewritten_claim_dict.intervention" v-on:keyup.enter="rewritten_claim_dict.inter_edit = false" :disabled="verify"> 
                                            <b @dblclick="rewritten_claim_dict.inter_edit = true" v-else>{{rewritten_claim_dict.intervention}}</b>
                                        </div>
                                    </div>
                                </div>
                                <div class="row pb-3 pt-1" v-if="has_rewrite">
                                    <div class="col-2">
                                        <b>
                                            Outcome: 
                                        </b>
                                    </div>
                                    <div class="col">
                                        <div class="highOut" style="border-radius: 20px; padding:0.375rem 0.75rem; display:inline-block;">
                                            <input type="text" v-if="rewritten_claim_dict.res_edit" v-autowidth :placeholder="rewritten_claim_dict.outcome" v-model="rewritten_claim_dict.outcome" v-on:keyup.enter="rewritten_claim_dict.res_edit = false" :disabled="verify"> 
                                            <b @dblclick="rewritten_claim_dict.res_edit = true" v-else>{{rewritten_claim_dict.outcome}}</b>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="row border-top pt-3" v-if="has_rewrite">
                                    <div class="col-2">
                                        <b>
                                            Rewritten Claim: 
                                        </b>
                                    </div>
                                    <div class="col">
                                        <span style="white-space: pre-line;">
                                            For 
                                            <input type="text" v-if="rewritten_claim_dict.pop_edit" v-autowidth :placeholder="rewritten_claim_dict.population" v-model="rewritten_claim_dict.population" v-on:keyup.enter="rewritten_claim_dict.pop_edit = false"> 
                                            <span class="high highBlue" @dblclick="rewritten_claim_dict.pop_edit = true" v-else>
                                                <div class="hovbox">
                                                    Population
                                                </div>{{rewritten_claim_dict.population}}
                                            </span>, the intervention,
                                            <input type="text" v-if="rewritten_claim_dict.inter_edit" v-autowidth :placeholder="rewritten_claim_dict.intervention" v-model="rewritten_claim_dict.intervention" v-on:keyup.enter="rewritten_claim_dict.inter_edit = false"> 
                                            <span class="high highInter" @dblclick="rewritten_claim_dict.inter_edit = true" v-else>
                                                <div class="hovbox">
                                                    Intervention
                                                </div>{{rewritten_claim_dict.intervention}}
                                            </span>, had the outcome of   
                                            <input type="text" v-if="rewritten_claim_dict.res_edit" v-autowidth :placeholder="rewritten_claim_dict.outcome" v-model="rewritten_claim_dict.outcome" v-on:keyup.enter="rewritten_claim_dict.res_edit = false"> 
                                            <span class="high highOut" @dblclick="rewritten_claim_dict.res_edit = true" v-else>
                                                <div class="hovbox">
                                                    Claimed Result
                                                </div>{{rewritten_claim_dict.outcome}}
                                            </span>.
                                        </span>
                                    </div>
                                </div> -->
                            </div>
                            <div class="col pb-3" v-if="verify">
                                <div class="row mb-3">
                                    <div class="col d-flex justify-content-center">
                                        <div class="btn-group" role="group" aria-label="Toggle Buttons">

                                            <input type="radio" class="btn-check" name="options-outlined1" id="success-outlined1" autocomplete="off" v-model="verify_info.claim_verify.label">
                                            <label class="btn btn-outline-success" for="success-outlined1"><b>Agree</b></label>

                                            <input type="radio" class="btn-check" name="options-outlined1" id="danger-outlined1" autocomplete="off" v-model="verify_info.claim_verify.label">
                                            <label class="btn btn-outline-danger" for="danger-outlined1"><b>Disagree</b></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <textarea class="form-control" rows="3" placeholder="Short rationale" v-model="verify_info.claim_verify.rationale"></textarea>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div v-if="claim_selected && !nonverifiable">
                            <div class="row">
                                <div class="col" :class="{ 'col-9': verify }">
                                    <div class="row mt-3">
                                        <div class="col">
                                            <draggable class="list-group list-group-horizontal" :list="drag_tabs" group="docs" itemKey="label" :disabled="verify">
                                                <template #item="{element}">
                                                    <div class="list-group-item" :class="{ 'flag-style':tabs[basic_table[element.label]].flagged, 'text-danger':tabs[basic_table[element.label]].flagged }" v-bind:style="{ backgroundColor: support_colors[element.label]}" v-on:dblclick="setActive_w_label(element.label)" @mousedown="stop_sorting()">{{ element.label }}</div>
                                                </template>
                                            </draggable>
                                        </div>
                                    </div>
                                    <draggable tag="div" :list="tiers" handle=".handle" item-key="tier" :disabled="verify">
                                        <template #item="{ element, index }">
                                            <div class="row mt-2">
                                                <div class="col"> 
                                                    <div class="card" style="background-color:  #F0F8FF;">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-sm-1 d-flex justify-content-center">
                                                                    T{{ index + 1 }}
                                                                </div>
                                                                <div class="col border">
                                                                    <draggable class="list-group list-group-horizontal" :list="element.t_lst" group="docs" itemKey="label" :disabled="verify">
                                                                        <template #item="{element}">
                                                                            <div class="list-group-item" :class="{ 'flag-style':tabs[basic_table[element.label]].flagged }" v-bind:style="{ backgroundColor: support_colors[element.label] }" v-on:dblclick="setActive_w_label(element.label)" @mousedown="stop_sorting()">{{ element.label }}</div>
                                                                        </template>
                                                                    </draggable>
                                                                </div>
                                                                <div class="col-1 d-flex justify-content-center" @click="deleteTier(index)">
                                                                    <i class="bi bi-trash-fill dot-color"></i>
                                                                </div>
                                                                <div class="col-1 handle justify-content-center">
                                                                    <i class="bi bi-three-dots-vertical dot-color"></i>
                                                                </div>
                                                            </div>
                                                            <div class="row mt-3">
                                                                <div class="col">
                                                                    <div class="input-group input-group-sm">
                                                                        <span class="input-group-text" id="inputGroup-sizing-sm">Label</span>
                                                                        <input type="text" class="form-control" v-model="element.description" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm":disabled="verify">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </draggable>
                                    <div class="row mt-2">
                                        <div class="col d-flex justify-content-center">
                                            <button class="btn btn-sm btn-secondary me-2" @click="addTier()" :disabled="verify">
                                                Add Tier
                                            </button>
                                            <button class="btn btn-sm btn-danger" @click="toggleSort()" v-if="sort_by_relevance" :disabled="verify">
                                                Stop Sorting
                                            </button>
                                            <button class="btn btn-sm btn-success" @click="toggleSort()" v-else :disabled="verify">
                                                Sort By Relevance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col pt-4" v-if="verify">
                                    <div class="row mb-3">
                                        <div class="col d-flex justify-content-center">
                                            <div class="btn-group" role="group" aria-label="Toggle Buttons">

                                                <input type="radio" class="btn-check" name="options-outlined2" id="success-outlined2" autocomplete="off" v-model="verify_info.tier_verify.label">
                                                <label class="btn btn-outline-success" for="success-outlined2"><b>Agree</b></label>

                                                <input type="radio" class="btn-check" name="options-outlined2" id="danger-outlined2" autocomplete="off" v-model="verify_info.tier_verify.label">
                                                <label class="btn btn-outline-danger" for="danger-outlined2"><b>Disagree</b></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <textarea class="form-control" rows="3" placeholder="Short rationale" v-model="verify_info.tier_verify.rationale"></textarea>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div class="row">
                                <div class="col" :class="{ 'col-9': verify }">
                                    <div class="row mt-4">
                                        <div class="col">
                                            <h5>Synthesis Annotations:</h5>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-4">
                                            <div class="row">
                                                <div class="col">
                                                    <div class="input-group">
                                                        <label class="input-group-text" for="inputGroupSelect01">Overall Support</label>
                                                        <select class="form-select sup-select" id="inputGroupSelect01" v-model="o_support_label" :disabled="verify">
                                                            <option v-for="(cat, index) in support_labels" v-bind:value="index">{{ cat }}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row mt-3">
                                                <div class="col">
                                                    <div class="input-group">
                                                        <label class="input-group-text" for="inputGroupSelect02">Expert Opinion</label>
                                                        <select class="form-select sup-select" id="inputGroupSelect02" v-model="o_ex_support_label" :disabled="verify">
                                                            <option v-for="(cat, index) in ex_support_labels" v-bind:value="index">{{ cat }}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="row">
                                                <div class="col d-flex justify-content-center">
                                                    <textarea class="form-control" rows="10" placeholder="Overall Explanation" v-model="o_exp" @input="get_count()" @mouseup="get_count_highlight()" :disabled="verify"></textarea>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <p>
                                                        Word Count: {{ o_exp_count }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col pt-3" v-if="verify">
                                    <div class="row mb-3">
                                        <div class="col d-flex justify-content-center">
                                            <div class="btn-group" role="group" aria-label="Toggle Buttons">

                                                <input type="radio" class="btn-check" name="options-outlined3" id="success-outlined3" autocomplete="off" v-model="verify_info.synthesis_verify.label">
                                                <label class="btn btn-outline-success" for="success-outlined3"><b>Agree</b></label>

                                                <input type="radio" class="btn-check" name="options-outlined3" id="danger-outlined3" autocomplete="off" v-model="verify_info.synthesis_verify.label">
                                                <label class="btn btn-outline-danger" for="danger-outlined3"><b>Disagree</b></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <textarea class="form-control" rows="3" placeholder="Short rationale" v-model="verify_info.synthesis_verify.rationale"></textarea>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="row mt-3">
                                <div class="col d-flex justify-content-center" @click="toggle_selection()">
                                    <i class="bi bi-chevron-up" style="font-size:20px;" v-if="claim_selected && !nonverifiable"></i>
                                    <i class="bi bi-chevron-down" style="font-size:20px;" v-else></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3" v-if="nonverifiable">
            <div class="col">
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <textarea class="form-control" rows="10" placeholder="Justify why this claim is non-RCT verifiable in 10 words" v-model="non_ver_just" @input="get_count_non_ver_just()" :disabled="verify"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p>
                            Word Count: {{ non_ver_just_count }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3" v-if="!nonverifiable">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Retrieved Abstracts</h5>
                        <ul class="nav nav-tabs">
                            <li class="nav-item" v-for="tab in tabs">
                                <a class="nav-link" @click="setActive(tab)" :class="{ active: tab.isActive }">{{ tab.label }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body tab-content">
                        <div v-for="(tab, index) in tabs" v-show="tab.isActive">
                            <div class="row">
                            <div class="col">
                                <div class="row pb-2">
                                    <div class="col">
                                        <h5><strong>{{ tab.title }}</strong></h5>
                                    </div>
                                </div>
                                <div class="row pb-2">
                                    <div class="col">
                                        <div class="highInter" style="border-radius: 20px; padding:0.375rem 0.75rem; display:inline-block; margin-right: 10px;">
                                            {{ tab.picor_label.PubDate }}
                                        </div>
                                        <!---<div class="highGreen" style="border-radius: 20px; padding:0.375rem 0.75rem; display:inline-block;">
                                            {{ tab.picor_label.Source }}
                                        </div>-->
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p style="white-space:pre-line;" v-html="tab_text" ref="absts">
                                        
                                        </p>
                                    </div>
                                </div>    
                            </div>
                            <div class="col-4 border-left">
                                <!-- <h5>Annotations:</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item" v-for="anno in tab.annot">
                                        {{ anno.label }}: &nbsp;    
                                        <select class="custom-select" v-model="anno.anno">
                                            <option v-for="(item, index) in items"  :key="anno.cat">{{ item }}</option>
                                        </select>
                                    </li>
                                </ul> -->
                                <div class="row pb-3">
                                    <div class="col"><h5>Annotations:</h5></div>
                                    <div class="col" v-if="tab.flagged" @click="update_flag(tab)">
                                        <i class="bi bi-flag-fill float-right text-danger clickable" style="float:right;"></i>
                                    </div>
                                    <div class="col" v-else @click="update_flag(tab)">
                                        <i class="bi bi-flag float-right clickable" style="float:right;"></i>
                                    </div>
                                </div>
                                <div class="row pb-2">
                                    <div class="col"><strong>Relevance</strong></div>
                                </div>
                                <div class="row pb-1" v-for="anno in tab.rel_anno">
                                    <!-- <div v-if="look_back(index, tab.annot)"> -->
                                    <div class="col" style="padding-top:7px;">{{ anno.label }}:</div>
                                    <div class="col-8">
                                        <select class="form-select rev-select" v-model="anno.anno" @change="update_tiers(anno, tab)" :disabled="verify">
                                            <option v-for="(cat, index) in anno.cats" v-bind:value="index">{{ cat }}</option>
                                        </select>
                                    </div>
                                    <!-- </div> -->
                                </div>
                                <div class="row pb-2" v-if="tab.claim_active">
                                    <div class="col"><strong>Claim Support</strong></div>
                                </div>
                                <div class="row pb-1" v-if="tab.claim_active">
                                    <div class="col" style="padding-top:7px;">{{ tab.claim_anno.label }}:</div>
                                    <div class="col-8">
                                        <select class="form-select sup-select" v-model="tab.claim_anno.anno" @change="update_colors(tab.claim_anno.anno, tab.label)" :disabled="verify">
                                            <option v-for="(cat, index) in tab.claim_anno.cats" v-bind:value="index">{{ cat }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row pb-1" v-if="tab.claim_active">
                                    <div class="col" style="padding-top:7px;">Relevant Span:</div>
                                    <div class="col-2">
                                        <button v-if="tab.button_mode" class="btn btn-outline-secondary float-right" style="float:right;" @click="finalizeRSpan(index)">
                                            Done
                                        </button>
                                        <button v-else class="btn btn-success float-right" style="float:right;" @click="highlightRelevantSpan(index)">
                                            Highlight
                                        </button>
                                    </div>
                                </div>

                                <div class="row pb-2">
                                    <div class="col"><strong>Optional Comments</strong></div>
                                </div>

                                <div class="row pb-1">
                                    <div class="col">
                                        <textarea class="form-control" rows="3" placeholder="Comments" v-model="tab.comment" :disabled="verify"></textarea>
                                    </div>
                                </div>

                                <div class="row">

                                    <div class="row pb-2">
                                        <div class="col"><strong>Verification</strong></div>
                                    </div>

                                    <div class="col pt-3" v-if="verify">
                                        <div class="row mb-3">
                                            <div class="col d-flex justify-content-center">
                                                <div class="btn-group" role="group" aria-label="Toggle Buttons">

                                                    <input type="radio" class="btn-check" :name="'options-outlined-ind' + index" :id="'success-outlined-ind' + index" autocomplete="off" v-model="verify_info.tab_verify[index].label">
                                                    <label class="btn btn-outline-success" :for="'success-outlined-ind' + index"><b>Agree</b></label>

                                                    <input type="radio" class="btn-check" :name="'options-outlined-ind' + index" :id="'danger-outlined-ind' + index" autocomplete="off" v-model="verify_info.tab_verify[index].label">
                                                    <label class="btn btn-outline-danger" :for="'danger-outlined-ind' + index"><b>Disagree</b></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <textarea class="form-control" rows="3" placeholder="Short rationale" v-model="verify_info.tab_verify[index].rationale"></textarea>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import draggable from "vuedraggable";
    import download from "downloadjs";
    import axios from 'axios';
    //import { invokeArrayFns } from '@vue/shared';
//import $ from 'jquery'
//import { l } from 'vite/dist/node/types.d-aGj9QkWt';
    export default {
        components: {
            draggable
        },
        data() {
            return {
                file: null,
                parsed_file: [], 
                findex: -1,
                redhot_post: "",
                tab_text: "",
                tabs: [],
                drag_tabs: [],
                verify_info: {
                    claim_verify: {
                        label: "",
                        rationale: "",
                    },
                    tier_verify: {
                        label: "",
                        rationale: "",
                    },
                    synthesis_verify: {
                        label: "",
                        rationale: "",
                    },
                    tab_verify: [],
                },
                sub_name: "",
                o_exp_count: 0,
                verify: false,
                non_ver_just: "",
                non_ver_just_count: 0,
                nonverifiable: false,
                disable_movement: false,
                pop_list:[],
                inter_list:[],
                out_list:[],
                has_rewrite: false,
                rewritten_claim_dict: {
                    population: "",
                    intervention: "",
                    outcome: "",
                    pop_edit: false,
                    inter_edit: false,
                    res_edit: false,
                },
                tiers: [
                    {
                        rank: 1,
                        t_lst: [],
                        description: "",
                    },
                    {
                        rank: 2,
                        t_lst: [],
                        description: "",
                    },
                    {
                        rank: 3,
                        t_lst: [],
                        description: "",
                    },
                ],
                support_colors: {},
                o_exp: "",
                basic_table: {},
                o_support_label: 0,
                o_ex_support_label: 0,
                support_labels: [
                    "No Relevant Abstracts",
                    "Refutes",
                    "Partially Refutes",
                    "Inconclusive",
                    "Partially Supports",
                    "Supports",
                ],
                ex_support_labels: [
                    "No Expert Opinion",
                    "Refutes",
                    "Partially Refutes",
                    "Inconclusive",
                    "Partially Supports",
                    "Supports",
                ],
                claim_selected: false,
                sort_by_relevance: true,
                selected_claim: "",
            }
        },
        mounted() {
            console.log("HELLO");
            //console.log(this.$route.query.test);
            let urlParams = new URLSearchParams(window.location.search);
            //console.log(urlParams.has('test'));
            //console.log(urlParams.get('test'));
            if (urlParams.has('load')) {
                console.log(urlParams.get('load'));
                this.load_file_from_sample(urlParams.get('load'));
            }

            if (urlParams.has('verify')) {
                this.verify_mode();
            }

        },
        methods: {
            verify_mode(){
                this.verify = true;
            },
            look_back(ind, annot, tab) {
                if (ind == 0) return true;
                if (!Object.keys(annot[ind]).includes("activate_if")) return true;
                if (annot[ind - 1].anno === annot[ind].activate_if) {
                    tab.doc_exp_active = true;
                    return true;
                } else {
                    tab.doc_exp_active = false;
                }
                return false;
            },
            get_count() {
                console.log(this.o_exp.length);
                if (this.o_exp.length == 0) {
                    console.log("HELP");
                    this.o_exp_count = 0;
                } else {
                    this.o_exp_count = this.o_exp.trim().split(" ").length;
                }
            },
            get_count_non_ver_just() {
                //console.log(this.o_exp.length);
                if (this.non_ver_just.length == 0) {
                    console.log("HELP");
                    this.non_ver_just_count = 0;
                } else {
                    this.non_ver_just_count = this.non_ver_just.trim().split(" ").length;
                    if (this.non_ver_just_count >= 10) {
                        this.disable_movement = false;
                    }
                }
            },
            toggle_verifiablity(){
                this.nonverifiable = !this.nonverifiable;
                if (this.nonverifiable && this.non_ver_just_count < 10) {
                    console.log("this happened");
                    this.disable_movement = true;
                } else {
                    this.disable_movement = false;
                }
            },
            get_count_highlight() {
                
                var select_str = "";

                if (document.activeElement) {
                    var sel_ele = document.activeElement;
                    select_str = this.o_exp.substring(
                        sel_ele.selectionStart,
                        sel_ele.selectionEnd
                    );
                } else {
                    select_str = window.getSelection().toString();
                }
                 
                if (select_str.length > 0 && this.o_exp.includes(select_str)) {
                    this.o_exp_count = select_str.trim().split(" ").length;
                } else {
                    this.get_count();
                }

            },
            stop_sorting() {
                this.sort_by_relevance = false;
            },
            toggleSort() {
                this.sort_by_relevance = !this.sort_by_relevance;
                if (this.sort_by_relevance) this.update_tiers();
            },
            toggle_selection(){
                if (!this.nonverifiable) {
                    this.claim_selected = !this.claim_selected;
                }
            },
            readfile() {
                this.redhot_post = "";
                this.tabs = [];
                this.file = this.$refs.doc.files[0];
                const reader = new FileReader();
                if(this.file.name.includes('.json')) {
                    reader.onload = (res) => {
                        this.parsed_file = JSON.parse(res.target.result);
                        this.findex = 0;
                        this.load_file();
                    }
                    reader.onerror = (err) => console.log(err);
                    reader.readAsText(this.file);
                }
            },
            load_file_from_sample(fname) {
                console.log(fname);
                axios.get(`https://raw.githubusercontent.com/SebaJoe/redhot_viewer/master/samples/${fname}`)
                .then((response) => {
                    console.log(response);
                    this.parsed_file = response.data;                    
                    //console.log(atob(response.data.content));
                    //this.parsed_file = JSON.parse(atob(response.data.content));
                    this.findex = 0;
                    this.load_file();
                })
                .catch((response) => {console.log(response);});
            },
            inc_findex() {
                this.save_state();
                if (this.findex < this.parsed_file.length - 1) {
                    this.findex++;
                    this.load_file();
                }
            },
            dec_findex() {
                this.save_state();
                if (this.findex > 0) {
                    this.findex--;
                    this.load_file();
                }
            },
            move_to_target(event) {
                let temp_val = event.target.value;
                //console.log("ENFKDF");
                //console.log(temp_val);
                //console.log(typeof temp_val);
                if (isNaN(parseInt(temp_val))) {
                    //console.log("The end times are nigh");
                    return;
                }
                this.save_state();

                if (temp_val - 1 >= this.parsed_file.length) {
                    this.findex = this.parsed_file.length - 1;
                    this.load_file();
                } else if (temp_val - 1 < 0) {
                    this.findex = 0;
                    this.load_file();
                } else {
                    this.findex = temp_val - 1;
                    this.load_file();
                }
            },
            set_defaults() {
                this.redhot_post = "";
                this.tab_text = "";
                this.tabs = [];
                this.drag_tabs = [];
                this.sub_name = "";
                this.non_ver_just = "";
                this.non_ver_just_count = 0;
                this.nonverifiable = false;
                this.verify_info = {
                    claim_verify: {
                        label: "",
                        rationale: "",
                    },
                    tier_verify: {
                        label: "",
                        rationale: "",
                    },
                    synthesis_verify: {
                        label: "",
                        rationale: "",
                    },
                    tab_verify: [],
                };
                this.tiers = [
                    {
                        rank: 1,
                        t_lst: [],
                        description: "",
                    },
                    {
                        rank: 2,
                        t_lst: [],
                        description: "",
                    },
                    {
                        rank: 3,
                        t_lst: [],
                        description: "",
                    },
                ];
                this.pop_list = [];
                this.inter_list = [];
                this.out_list = [];
                this.rewritten_claim_dict = {
                    population: "",
                    intervention: "",
                    outcome: "",
                };
                this.has_rewrite = false;
                this.claim_selected = false;
                this.selected_claim = "";
                this.support_colors = {};
                this.basic_table = {};
                this.o_exp = "";
                this.o_support_label = 0;
                this.o_ex_support_label = 0;
                this.sort_by_relevance = true;
            },
            load_file() {
                this.set_defaults();

                const sub_id_to_population_map = {
                    "t5_2rtve": "lupus",
                    "t5_2syer" : "gout",
                    "t5_2s3g1" : "ibs",
                    "t5_2tyg2" : "Psychosis",
                    "t5_395ja" : "costochondritis",
                    "t5_2saq9" : "POTS",
                    "t5_2s23e" : "MultipleSclerosis",
                    "t5_2s1h9" : "Epilepsy",
                    "t5_2qlaa" : "GERD",
                    "t5_2r876" : "CysticFibrosis",
                    "t5_2tqwy" : "rheumatoidarthritis",
                    "t5_2s453" : "IBD",
                    "t5_2srfv" : "Dysthymia",
                    "t5_2r4lw" : "CFS",
                    "t5_2tmc8" : "bulimia",
                    "t5_2rhx3" : "narcolepsy",
                    "t5_2s0tv" : "Hypothyroidism",
                    "t5_3e8dw" : "thyroidcancer",
                    "t5_vqneh" : "Sinusitis",
                    "t5_2rhwk" : "Hyperhidrosis",
                    "t5_2qnwb" : "ADHD",
                    "t5_2usbg" : "Gastroparesis",
                    "t5_2qhsj" : "Diabetes",
                    "t5_2tnlj" : "ankylosingspondylitis"
                }

                this.sub_name = sub_id_to_population_map[this.parsed_file[this.findex].subreddit_id];

                this.redhot_post = this.parsed_file[this.findex].text;
                this.selected_claim = this.parsed_file[this.findex].claim;

                
                if (Object.keys(this.parsed_file[this.findex]).includes('intervention')) {
                    this.has_rewrite = true;
                }

                if (this.has_rewrite) {
                    this.inter_list = [this.parsed_file[this.findex].intervention];

                    this.pop_list = [this.parsed_file[this.findex].population];
                    this.out_list = [this.parsed_file[this.findex].outcome];
                    this.rewritten_claim_dict.population = this.pop_list[0];
                    this.rewritten_claim_dict.intervention = this.inter_list[0];
                    this.rewritten_claim_dict.outcome = this.out_list[0];
                }

                let end_label = '</span>';
                const stage_2 = JSON.parse(this.parsed_file[this.findex].stage2_labels)[0]['crowd-entity-annotation']['entities'];
                let stage_2_tag = '<span class="high highBlue " id="index_rep"><div class="hovbox s2tag">replace</div>';
                console.log(Object.keys(this.parsed_file[this.findex]));
                if (Object.keys(this.parsed_file[this.findex]).includes("stage1_labels")) {
                    const stage_1 = JSON.parse(this.parsed_file[this.findex].stage1_labels)[0]['crowd-entity-annotation']['entities'];
                    let stage_1_tag = '<span class="high highYellow"><div class="hovbox">replace</div>';
                    for (let i = 0; i < stage_1.length; i++) {
                        //wrap span with span
                        let start = stage_1[i].startOffset;
                        let end = stage_1[i].endOffset;
                        let label = stage_1[i].label;
                        console.log(label);

                        console.log(stage_1);
                        console.log(this.redhot_post.slice(start, end));

                        console.log(label);
                        let stage_1_tag_mod = stage_1_tag.replace('replace', label);
                        console.log(end_label);

                        let comp_claim = "";
                        
                        console.log(Object.keys(this.parsed_file));

                        if (Object.keys(this.parsed_file[this.findex]).includes('claim_x')) {
                            comp_claim = this.parsed_file[this.findex].claim_x.trim();
                        } else {
                            comp_claim = this.parsed_file[this.findex].claim.trim();
                        }

                        const levenshteinDistance = (s, t) => {
                            if (!s.length) return t.length;
                            if (!t.length) return s.length;
                            const arr = [];
                            for (let i = 0; i <= t.length; i++) {
                                arr[i] = [i];
                                for (let j = 1; j <= s.length; j++) {
                                arr[i][j] =
                                    i === 0
                                    ? j
                                    : Math.min(
                                        arr[i - 1][j] + 1,
                                        arr[i][j - 1] + 1,
                                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                                        );
                                }
                            }
                            return arr[t.length][s.length];
                        };  

                        if (levenshteinDistance(this.redhot_post.slice(start, end).trim(), comp_claim) < 5) {
                            stage_1_tag_mod = stage_1_tag_mod.replace('highYellow', 'highdYellow');
                            stage_1_tag_mod = stage_1_tag_mod.replace(label, label + " (target)");
                        }

                        console.log("ANALYZE");
                        console.log(this.redhot_post.slice(start, end));
                        console.log(this.parsed_file[this.findex].claim);

                        this.redhot_post = this.redhot_post.slice(0, start) 
                                            + stage_1_tag_mod 
                                            + this.redhot_post.slice(start, end)
                                            + end_label
                                            + this.redhot_post.slice(end);
                        for (let j = i + 1; j < stage_1.length; j++) {
                            let j_start = stage_1[j].startOffset;
                            let j_end = stage_1[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_1[j].startOffset = get_update_func(j_start, start, end, stage_1_tag_mod.length, end_label.length);
                            stage_1[j].endOffset = get_update_func(j_end, start, end, stage_1_tag_mod.length, end_label.length)
                        }
                        for (let j = 0; j < stage_2.length; j++) {
                            let j_start = stage_2[j].startOffset;
                            let j_end = stage_2[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_2[j].startOffset = get_update_func(j_start, start, end, stage_1_tag_mod.length, end_label.length);
                            stage_2[j].endOffset = get_update_func(j_end, start, end, stage_1_tag_mod.length, end_label.length)
                        }
                    }
                } else {
                    let stage_1_tag = '<span class="high highdYellow"><div class="hovbox">Claim (target)</div>';
                    let comp_claim = this.parsed_file[this.findex].claim.trim();
                    let start = this.redhot_post.indexOf(comp_claim);
                    if (start != -1) {
                        let end = start + comp_claim.length;
                        this.redhot_post = this.redhot_post.slice(0, start) 
                                            + stage_1_tag 
                                            + this.redhot_post.slice(start, end)
                                            + end_label
                                            + this.redhot_post.slice(end);
                        for (let j = 0; j < stage_2.length; j++) {
                            let j_start = stage_2[j].startOffset;
                            let j_end = stage_2[j].endOffset;
                            const get_update_func = (val, start, end, startLen, endLen) => {
                                if (val >= start && val <= end) return val + startLen;
                                else if (val >= start) return val + startLen + endLen;
                                else return val;
                            }
                            stage_2[j].startOffset = get_update_func(j_start, start, end, stage_1_tag.length, end_label.length);
                            stage_2[j].endOffset = get_update_func(j_end, start, end, stage_1_tag.length, end_label.length)
                        }
                    }
                }   
                for (let i = 0; i < stage_2.length; i++) {
                    //wrap span with span
                    let start = stage_2[i].startOffset;
                    let end = stage_2[i].endOffset;
                    let label = stage_2[i].label;

                    //console.log(stage_1);
                    //console.log(this.redhot_post.slice(start, end));

                    let stage_2_tag_mod = stage_2_tag.replace('replace', label).replace("index_rep", "index_" + i);
                    console.log(end_label);
                    

                    this.redhot_post = this.redhot_post.slice(0, start) 
                                        + stage_2_tag_mod 
                                        + this.redhot_post.slice(start, end)
                                        + end_label
                                        + this.redhot_post.slice(end);

                    
                    for (let j = i + 1; j < stage_2.length; j++) {
                        let j_start = stage_2[j].startOffset;
                        let j_end = stage_2[j].endOffset;
                        const get_update_func = (val, start, end, startLen, endLen) => {
                            if (val >= start && val <= end) return val + startLen;
                            else if (val >= start) return val + startLen + endLen;
                            else return val;
                        }
                        stage_2[j].startOffset = get_update_func(j_start, start, end, stage_2_tag_mod.length, end_label.length);
                        stage_2[j].endOffset = get_update_func(j_end, start, end, stage_2_tag_mod.length, end_label.length)
                    }
                }

                const interval = setInterval(() => {      
                    if (this.$refs.postcard) {        
                        let eles = this.$refs.postcard.getElementsByClassName('high');           
                        this.triggerHoverEvents(eles);
                        //let s_claim = this.$refs.postcard.getElementsByClassName('highdYellow');
                        // Array.from(s_claim).forEach((sc) => {
                        //     sc.addEventListener('click', (e) => {
                        //         if (e.target.style.border !== "") {
                        //             Array.from(s_claim).forEach((s) => {s.style.border = ""; s.style['border-radius'] = '5px';});
                        //             this.claim_selected = false;
                        //             //this.selected_claim = "";
                        //         } else {
                        //             Array.from(s_claim).forEach((s) => {s.style.border = ""; s.style['border-radius'] = '5px';});
                        //             console.log(sc.innerHTML);
                        //             let temp = document.createElement('div');
                        //             temp.innerHTML = sc.innerHTML;
                        //             const divs = temp.querySelectorAll('div');
                        //             divs.forEach(div => div.remove());
                        //             this.selected_claim = temp.textContent;
                        //             this.claim_selected = true;
                        //             sc.style.border = "2px solid #6aa84f";
                        //             sc.style['border-radius'] = '5px';
                        //         }
                        //     });
                        // });
                        let hovs = this.$refs.postcard.getElementsByClassName('hovbox');
                        Array.from(hovs).forEach((ele) => {
                            ele.addEventListener('click', (e) => {
                                e.stopPropagation();
                            });
                        });
                        let s2_eles = this.$refs.postcard.getElementsByClassName('s2tag');
                        Array.from(s2_eles).forEach((ele) => {
                            ele.addEventListener('dblclick', (e) => {
                                console.log(ele.innerHTML);
                                let text = ele.textContent;
                                if (text !== "") {
                                    let inp = '<input type="text" class="s2_rep" value="replace_val">';
                                    inp = inp.replace("replace_val", text);
                                    ele.innerHTML = inp;
                                    ele.children[0].addEventListener('keypress', (e2) => {
                                        if (e2.key === 'Enter') {
                                            console.log("triggered");
                                            let val = ele.children[0].value;
                                            ele.innerHTML = val;
                                            const match = ele.parentElement.id.match(/index_(\d+)/);
                                            console.log(match);
                                            //stage_2[parseInt(match[1])].label = val;
                                            let s2 = JSON.parse(this.parsed_file[this.findex].stage2_labels);
                                            s2[0]['crowd-entity-annotation']['entities'][parseInt(match[1])].label = val;
                                            this.parsed_file[this.findex].stage2_labels = JSON.stringify(s2);
                                        }
                                    });    
                                }
                            });
                            ele.addEventListener('mouseleave', (e) => {
                                console.log("left");
                                let text = ele.textContent;
                                if (text === "") {
                                    let val = ele.children[0].value;
                                    ele.innerHTML = val;
                                    const match = ele.parentElement.id.match(/index_(\d+)/);
                                    console.log(match);
                                    //stage_2[parseInt(match[1])].label = val;
                                    let s2 = JSON.parse(this.parsed_file[this.findex].stage2_labels);
                                    s2[0]['crowd-entity-annotation']['entities'][parseInt(match[1])].label = val;
                                    this.parsed_file[this.findex].stage2_labels = JSON.stringify(s2);
                                }
                            });
                        });
                        clearInterval(interval);      
                    }    
                }, 50);
                const filterKeys = (suff) => {
                    var filtered = [];
                    var keys = Object.keys(this.parsed_file[this.findex]).filter((key) => key.endsWith(suff)).sort((a, b) => {parseInt(a.slice(1)) - parseInt(b.slice(1))});
                    console.log(keys);
                    for (var key of keys) {
                        filtered.push({label: key.replace(suff, ""), text: this.parsed_file[this.findex][key]});
                    }
                    return filtered;
                }           
                const filterKeys_s = (pre) => {
                    var filtered = [];
                    console.log(Object.keys(this.parsed_file[this.findex]).filter((key) => key.startsWith(pre) && key.length < 4));
                    var keys = Object.keys(this.parsed_file[this.findex]).filter((key) => key.startsWith(pre) && key.length < 4).sort((a, b) => {parseInt(a.slice(1)) - parseInt(b.slice(1))});
                    console.log(keys);
                    for (var key of keys) {
                        filtered.push(this.parsed_file[this.findex][key]);
                    }
                    return filtered;
                } 
                let docs = filterKeys('_doc');
                let titles = filterKeys_s('t');
                let doc_claims = filterKeys_s('p');
                let picor_labels = this.parsed_file[this.findex].TS_PICOR;
                console.log(titles);
                console.log(doc_claims);
                let annos = filterKeys('_anno')
                let annos_present = annos.length === docs.length;
                let tab_annos = null;
                if (Object.keys(this.parsed_file[this.findex]).includes("tab_annos")) {
                    tab_annos = this.parsed_file[this.findex]['tab_annos'];
                }
                //console.log("MANIAC");
                //console.log(tab_annos[0].rel_span);
                this.tabs = [];
                this.drag_tabs = [];
                let relevance_arr = [
                    "Select",
                    "Irrelevant",
                    "Somewhat Relevant",
                    "Relevant",
                ];
                for (let i = 0; i < docs.length; i++) {
                    console.log("wft");
                    //if (i === 0) console.log(Object.keys(tab_annos).includes('rel_span'));
                    this.verify_info.tab_verify.push({
                        label: "",
                        rationale: "",
                    });
                    this.support_colors[docs[i]['label']] = "";
                    this.basic_table[docs[i]['label']] = i;
                    this.tabs.push({
                        label: docs[i]["label"],
                        title: titles[i],
                        doc: docs[i].text,
                        doc_claim: doc_claims[i],
                        isActive: false,
                        button_mode: false,
                        rel_span: (tab_annos !== null && Object.keys(tab_annos[i]).includes('rel_span')) ? tab_annos[i]['rel_span'] : [], 
                        //claim_exp: (tab_annos !== null) ? tab_annos[i]["claim_exp"]: "",
                        comment: (tab_annos != null && Object.keys(tab_annos[i]).includes('comment')) ? tab_annos[i]["comment"]: "",
                        claim_active: (tab_annos !== null) ? tab_annos[i]["claim_active"]: false,
                        flagged: (tab_annos != null && Object.keys(tab_annos[i]).includes('flagged')) ? tab_annos[i]["flagged"]: false,
                        has_add_info: false,
                        claim_anno: (tab_annos !== null) ? tab_annos[i]["claim_anno"]:{
                            label: "Label",
                            anno: 0,
                            cats: [
                                "Select",
                                "Refutes",
                                "Partially Refutes",
                                "Partially Supports",
                                "Supports",
                            ],
                        },
                        rel_anno: (tab_annos !== null) ? tab_annos[i]["rel_anno"]:[
                        {
                            label: "Population",
                            anno: 0,
                            cats: relevance_arr,
                        },
                        {
                            label: "Intervention",
                            anno: 0,
                            cats: relevance_arr,
                        },
                        {
                            label: "Outcome",
                            anno: 0,
                            cats: relevance_arr,
                        },
                        {
                            label: "Overall",
                            anno: (annos_present) ? annos[i].text: 0,
                            cats: relevance_arr,
                        },
                        ]
                    });
                }
                console.log(this.tabs);
                if (picor_labels) {
                    for (let i = 0; i < docs.length; i++) {
                        this.tabs[i]['picor_label'] = picor_labels[i];
                        if (Object.keys(picor_labels[i]).includes('PubDate')) {
                            this.tabs[i].has_add_info = true;
                        }
                    }
                }

                let copy = JSON.parse(JSON.stringify(this.tabs));

                this.drag_tabs = copy;

                if (Object.keys(this.parsed_file[this.findex]).includes("annotator_verification")) {
                    this.verify_info = this.parsed_file[this.findex]['annotator_verification'];
                }

                if (Object.keys(this.parsed_file[this.findex]).includes("claim_annos")) {
                    let claim_annos = this.parsed_file[this.findex]['claim_annos'];
                    this.sort_by_relevance = claim_annos['sort_by_relevance'];
                    console.log("FOREE");
                    console.log(claim_annos);
                    this.drag_tabs = claim_annos['drag_tabs'].map((i) => copy[i]);
                    this.tiers = [];
                    this.support_colors = (Object.keys(claim_annos).includes("support_colors")) ? claim_annos['support_colors']: {};
                    this.update_all_colors();
                    this.o_exp = claim_annos['o_exp'];
                    this.o_support_label = claim_annos['o_support_label'];
                    this.o_ex_support_label = (Object.keys(claim_annos).includes("o_ex_support_label")) ? claim_annos["o_ex_support_label"] : 0;
                    this.rewritten_claim_dict = (Object.keys(claim_annos).includes("rewritten_claim")) ? claim_annos['rewritten_claim'] : this.rewritten_claim_dict;
                    this.nonverifiable = (Object.keys(claim_annos).includes("nonverifiable")) ? claim_annos['nonverifiable'] : this.nonverifiable;
                    this.non_ver_just = (Object.keys(claim_annos).includes("nonverifiable")) ? claim_annos['verification_justification'] : this.non_ver_just;
                    if (Object.keys(claim_annos).includes('support_labels')) {
                        this.support_labels = claim_annos['support_labels'];
                    } else {
                        //legacy labels
                        this.support_labels = [
                            "N/A",
                            "Refutes",
                            "Partially Refutes",
                            "Partially Supports",
                            "Supports",
                        ];
                    }
                    if (Object.keys(claim_annos).includes('ex_support_labels')) this.ex_support_labels = claim_annos['ex_support_labels'];
                    for (let i = 0; i < claim_annos['tiers'].length; i++) {
                        this.tiers.push({
                            rank: i,
                            t_lst: claim_annos['tiers'][i]['t_lst'].map((i) => copy[i]),
                            description: claim_annos['tiers'][i]['description'],
                        });
                    }
                }
                this.get_count();
                this.get_count_non_ver_just();
                this.setActive(this.tabs[0]);
            },
            save_state() {
                this.parsed_file[this.findex]['tab_annos'] = this.tabs.map((tab) => {
                    return {
                        rel_anno: tab.rel_anno, 
                        comment: tab.comment,
                        //claim_exp: tab.claim_exp, 
                        claim_active:tab.claim_active, 
                        claim_anno:tab.claim_anno, 
                        rel_span: tab.rel_span,
                        flagged: tab.flagged,
                    };
                });
                this.parsed_file[this.findex]['claim_annos'] = {};
                this.parsed_file[this.findex]['claim_annos']['annotated_claim'] = this.selected_claim; 
                this.parsed_file[this.findex]['claim_annos']['drag_tabs'] = this.drag_tabs.map((tab) => this.tabs.map((t) => t.title).indexOf(tab.title));
                this.parsed_file[this.findex]['claim_annos']['tiers'] = [];
                this.parsed_file[this.findex]['claim_annos']['sort_by_relevance'] = this.sort_by_relevance;
                this.parsed_file[this.findex]['claim_annos']['support_colors'] = this.support_colors;
                this.parsed_file[this.findex]['claim_annos']['o_exp'] = this.o_exp;
                this.parsed_file[this.findex]['claim_annos']['o_support_label'] = this.o_support_label;
                this.parsed_file[this.findex]['claim_annos']['o_ex_support_label'] = this.o_ex_support_label;
                this.parsed_file[this.findex]['claim_annos']['support_labels'] = this.support_labels;
                this.parsed_file[this.findex]['claim_annos']['ex_support_labels'] = this.ex_support_labels;
                this.parsed_file[this.findex]['claim_annos']['rewritten_claim'] = this.rewritten_claim_dict;
                this.parsed_file[this.findex]['claim_annos']['nonverifiable'] = this.nonverifiable;
                this.parsed_file[this.findex]['claim_annos']['verification_justification'] = this.non_ver_just;
                this.parsed_file[this.findex]['annotator_verification'] = this.verify_info;
                for (let i = 0; i < this.tiers.length; i++) {
                    this.parsed_file[this.findex]['claim_annos']['tiers'].push({
                        t_lst: this.tiers[i].t_lst.map((tab) => this.tabs.map((t) => t.title).indexOf(tab.title)),
                        description: this.tiers[i].description,
                    });
                }
            },
            update_colors(anno, tab_label){
                //console.log(anno);
                let labels = ["white", "rgba(250, 173, 240, 0.9)", " rgba(245, 209, 66, 0.9) " , "rgb(243, 243, 162, 0.9)", "rgb(175, 247, 175, 0.9)"];
                this.support_colors[tab_label] = labels[anno];
            },
            update_flag(tab) {
                if (this.verify) {
                    return;
                }
                tab.flagged = !tab.flagged;
                this.support_colors[tab.label + "_flag"] = tab.flagged;
            },
            update_all_colors(){
                this.tabs.forEach((tab) => {
                    if (Object.keys(tab).includes('claim_anno')) {
                        console.log(tab);
                        this.update_colors(tab.claim_anno.anno, tab.label);
                    }
                });
            },
            highlightRelevantSpan(tab_ind) {
                document.documentElement.style.setProperty("--highlight-color", "#66dadd");
                this.tabs[tab_ind].button_mode = true;
                this.printAbs();
            },
            finalizeRSpan(tab_ind) {
                document.documentElement.style.setProperty("--highlight-color", "#c2d7eb");
                this.tabs[tab_ind].button_mode = false;

                const select = window.getSelection();
                
                let ranges = [];
                for (let i = 0; i < select.rangeCount; i++) {
                    ranges.push(select.getRangeAt(i).toString());
                }

                this.tabs[tab_ind].rel_span = ranges;

                this.printAbs();
            },
            update_tiers(anno=null, tab=null) {
                if (anno != null && anno.label === 'Overall' && anno.anno === 3) {
                    tab.claim_active = true;
                } else if (anno != null && anno.label === 'Overall') {
                    tab.claim_active = false;
                }
                if (!this.sort_by_relevance) {
                    return;
                }
                let relevant_bucket = [];
                let sr_bucket = [];
                let i_good_bucket = [];
                let ir_bucket = [];
                for (let i = 0; i < this.tabs.length; i++) {
                    let get_anno = (i, label) => {
                        for (let anno of this.tabs[i].rel_anno) {
                            if (anno.label === label) return anno;
                        }
                    };
                    let anno_val = get_anno(i, "Overall").anno;
                    if (anno_val == 3) {
                        relevant_bucket.push(i);
                    } else if (anno_val == 2) {
                        sr_bucket.push(i);
                    } else if (anno_val == 1) {
                        let pio_vals = ['Population', 'Intervention', 'Outcome'].map((l) => get_anno(i, l).anno);
                        if (pio_vals.includes(3) || pio_vals.includes(2)) {
                            i_good_bucket.push(i);
                        } else {
                            ir_bucket.push(i);
                        }
                    }
                }

                let copy = JSON.parse(JSON.stringify(this.tabs));

                //this.drag_tabs = copy;

                this.tiers = [];
                let iterate_tiers = [
                    {
                        bucket: relevant_bucket,
                        label: "All Relevant Abstracts",
                    },
                    {
                        bucket: sr_bucket,
                        label: "All Somewhat Relevant Abstracts",
                    },
                    {
                        bucket: i_good_bucket,
                        label: "Irrelevant Abstracts containing at least 1 non-irrelevant PIO element",
                    },
                    {
                        bucket: ir_bucket,
                        label: "Completely Irrelevant Abstracts",
                    }
                ];
                let used = [];
                iterate_tiers.forEach((ele) => {
                    this.tiers.push({
                        t_lst: ele.bucket.map((i) => copy[i]),
                        description: ele.label,
                    });
                    for (let v of ele.bucket) {
                        used.push(v);
                    }
                });

                //let unused = [];
                this.drag_tabs = [];
                for(let i = 0; i < copy.length; i++) {
                    if (!used.includes(i)) {
                        this.drag_tabs.push(copy[i]);
                    }
                }

            },
            setActive(tab) {
                for (let i = 0; i < this.tabs.length; i++) {
                    this.tabs[i].isActive = false;
                }
                tab.isActive = true;
                this.printAbs();
            },
            setActive_w_label(tab_label) {
                for (let i = 0; i < this.tabs.length; i++) {
                    this.tabs[i].isActive = (this.tabs[i].label === tab_label);
                }
                this.printAbs();
            },
            highlightPICOR(doc, span, label, classname) {
                let h_tag = '<span class="high ' + classname + '"><div class="hovbox">'+ label + '</div>replace</span>';
                h_tag = h_tag.replace("replace", span);
                return doc.replace(span, h_tag);
            },
            printAbs() {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].isActive) {
                        // let h_tag = '<span class="high highGreen"><div class="hovbox">Relevant Span</div>replace</span>';
                        // if (!this.tabs[i].doc.includes(this.tabs[i].doc_claim)){
                        //     //this.tabs[i].doc_claim = this.tabs[i].doc_claim.replaceAll("=", " = ");
                        //     console.log("ERROR ALERT");
                        // }
                        // h_tag = h_tag.replace("replace", this.tabs[i].doc_claim);
                        // console.log(this.tabs[i].doc_claim);
                        // return this.tabs[i].doc.replace(this.tabs[i].doc_claim, h_tag);
                        if (this.tabs[i].button_mode) {
                            this.tab_text = this.tabs[i].doc.replaceAll("\n\n\n", "TRIPLLE_TOO_DOOUBLE").replaceAll("\n", "\n\n").replaceAll("TRIPLLE_TOO_DOOUBLE", "\n\n");
                            break;
                        }

                        let all_h = []
                        all_h.push({span:this.tabs[i].doc_claim, label:"Punchline", cname: "highGreen"});

                        //console.log("THIS IS IT BOYS");
                        //console.log(this.tabs[i]);
                        if (Object.keys(this.tabs[i]).includes('rel_span')) {
                            //console.log(this.tabs[i].rel_span);
                            this.tabs[i].rel_span.forEach((ele) => {
                                all_h.push({span: ele, label: "Relevant Span", cname: "highRel"});
                            });
                            //console.log(this.tabs[i].rel_span);
                        }   


                        //all_h.push({span:this.tabs[i].picor_label.Punchline, label:"Punchline", cname: "highBlue"});
                        let cname_dict = {
                            "Population": "highBlue",
                            "Intervention": "highInter",
                            "Outcome": "highOut",
                        };
                        if(Object.keys(this.tabs[i]).includes("picor_label")) {
                            let l_labels = Object.keys(this.tabs[i].picor_label);
                            for (let lab of l_labels) {
                                if (Array.isArray(this.tabs[i].picor_label[lab])) {
                                    let lab_arr = this.tabs[i].picor_label[lab];
                                    for (let sp of lab_arr) {
                                        all_h.push({span:sp, label:lab, cname:cname_dict[lab]});
                                    }
                                }
                            }
                        }
                        all_h.sort((a, b) => {
                            return b.span.length - a.span.length;
                        });
                        var doc_copy = (" " + this.tabs[i].doc).slice(1);
                        doc_copy = doc_copy.replaceAll("\n\n\n", "TRIPLLE_TOO_DOOUBLE").replaceAll("\n", "\n\n").replaceAll("TRIPLLE_TOO_DOOUBLE", "\n\n");
                        for (let h of all_h) {
                            let new_span = h.span.replaceAll("\n\n\n", "TRIPLLE_TOO_DOOUBLE").replaceAll("\n", "\n\n").replaceAll("TRIPLLE_TOO_DOOUBLE", "\n\n");
                            doc_copy = this.highlightPICOR(doc_copy, new_span, h.label, h.cname);
                        }
                        this.tab_text = doc_copy;
                        const interval = setInterval(() => {      
                            if (this.$refs.absts) {        
                                let eles = this.$refs.absts[i].getElementsByClassName('high');           
                                this.triggerHoverEvents(eles);
                                clearInterval(interval);      
                            }    
                        }, 50);
                        break;
                    }
                }
            },
            triggerHoverEvents(eles) {
                Array.from(eles).forEach((ele) => {
                    ele.addEventListener('mouseenter', (e) => {
                        console.log(ele === e.target);

                        Array.from(eles).forEach((q) => {
                            q.firstChild.style.left = "";
                            q.firstChild.style.top = "";
                            q.firstChild.style['border-radius'] = "";
                        });

                        
                        
                        e.stopPropagation();
                        console.log(ele.firstChild);
                        ele.firstChild.style.left = 0 + "px";
                        ele.firstChild.style.top = 0 + 'px';
                        let clientRect = ele.firstChild.getBoundingClientRect();

                        ele.firstChild.style.left = (e.clientX - clientRect.left) + "px";
                        ele.firstChild.style.top = (e.clientY - clientRect.top - clientRect.height) + 'px';
                        ele.firstChild.style['border-radius'] = '5px';
                        
                    });
                    ele.addEventListener('mouseleave', (e) => {
                        e.stopPropagation();
                        //ele.firstChild.style.left = 0 + "px";
                        //ele.firstChild.style.top = 0 + 'px';
                        ele.firstChild.style.left = "";
                        ele.firstChild.style.top = '';
                        ele.firstChild.style['border-radius'] = '';
                    });
                });
            },



            deleteTier(index) {
                if (this.verify) {
                    return;
                }
                this.tiers[index].t_lst.forEach((ele) => this.drag_tabs.push(ele));
                this.tiers.splice(index, 1);
            },
            addTier() {
                this.tiers.push(
                    {
                        rank: this.tiers.length + 1,
                        t_lst: [], 
                        description: "",
                    }
                );
            },
            download_parsed_file() {
                this.save_state();
                const current_date = new Date();
                console.log(JSON.parse(JSON.stringify(this.parsed_file)));
                let end_object = JSON.stringify(this.parsed_file)
                end_object = end_object.replace(/[\u007F-\uFFFF]/g, function(chr) {
                                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
                            });
                download(end_object, "redhot_parsed_" + current_date.toString().replace(" ", "_") + ".json", 'application/json');
            }
        },
        computed: {
            printPost() {
                return this.redhot_post;
            }
        }
    }
</script>

<style lang="scss">

    :root {
        --highlight-color: #c2d7eb;
    }

    .highYellow {
        background: rgb(243, 243, 162, 0.9);
    }
    .highBlue {
        background: rgb(173, 173, 250, 0.9);
    }

    .highRel {
        background: #66dadd;
    }

    .highInter {
        background: rgba(250, 173, 240, 0.9);
    }

    .highOut {
        background: rgba(173, 250, 246, 0.9);
    }

    .highGreen {
        background: rgb(175, 247, 175, 0.9);
    }

    .highdYellow {
        background: rgb(209, 249, 151, 0.9);
    }

    ::selection {
        background: var(--highlight-color);
    }

    .hovbox {
        display: none;
    }

    .high:hover > .hovbox {
        display: inline-block;
        position: absolute;
        margin-top: -26px;
        background-color: inherit;
        padding: 5px 5px 0px 5px;
        color: black;
        border-radius: 5px 5px 0px 0px;
        filter: brightness(90%) saturate(200%);
    }

    .s2_rep {
        width: inherit;
        background-color: inherit;
    }

    .rev-select option[value="3"] {
        background: rgb(175, 247, 175, 0.9);
    }

    .rev-select option[value="2"] {
        background: rgb(243, 243, 162, 0.9);

    }

    .rev-select option[value="1"] {
        background: rgba(243, 190, 176, 0.9);
    }

    .sup-select option[value="5"] {
        background: rgba(32, 235, 32, 0.9);
    }

    .sup-select option[value="4"] { 
        background: rgb(175, 247, 175, 0.9);
    }

    .sup-select option[value="3"] {
        background: rgb(243, 243, 162, 0.9);

    }

    .sup-select option[value="2"] {
        background: rgba(223, 204, 118, 0.9);

    }

    .sup-select option[value="1"] {
        background: rgba(243, 190, 176, 0.9);
    }

    .flag-style {
        font-weight: bold;
    }

    .dot-color {
        color: #b7d2e9;
    }

    .dot-color:hover {
        color: #626d77;
    }

</style>