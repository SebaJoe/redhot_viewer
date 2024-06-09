<template>
    <div class="container">
        <div class="row mt-2">
            <div class="col">
                <h1>RedHot Annotation Viewer</h1>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-3">
                <input class="form-control" type="file" ref="doc" @change="readfile()"/>
            </div>
            <div class="col">
                <button class="btn btn-light float-right" @click="dec_findex()">
                    <i class="bi bi-chevron-left"></i>
                </button>
            </div>
            <div class="col d-flex justify-content-center">
                <h4>{{ findex+1 }} / {{ parsed_file.length }}</h4>
            </div>
            <div class="col">
                <button class="btn btn-light float-left" @click="inc_findex()">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="col-3">
                <button class="btn btn-outline-secondary float-right" @click="download_parsed_file()">
                    Download
                </button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col">
                <div class="card" style="background-color:#ffe4e3;">
                    <div class="card-header text-muted">
                        RedHot Post
                    </div>
                    <div class="card-body">
                        <span style="white-space: pre-line;" v-html="redhot_post" ref="postcard">
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3" v-if="claim_selected">
            <div class="col">
                <div class="card" style="background-color:#F0F1FF;">
                    <div class="card-header text-muted">
                        Selected Claim
                    </div>
                    <div class="card-body">
                        <div class="row border-bottom">
                            <div class="col pb-3">
                                <span style="white-space: pre-line;">
                                    {{ selected_claim }}
                                </span>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <draggable class="list-group list-group-horizontal" :list="drag_tabs" group="docs" itemKey="label">
                                    <template #item="{element}">
                                        <div class="list-group-item" style="background-color: #F8FFF0;">{{ element.label }}</div>
                                    </template>
                                </draggable>
                            </div>
                        </div>
                        <div class="row mt-2" v-for="tier in tiers">
                            <div class="col"> 
                                <div class="card" style="background-color:  #F0F8FF;">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-sm-1 d-flex justify-content-center">
                                                T{{ tier.rank }}
                                            </div>
                                            <div class="col border">
                                                <draggable class="list-group list-group-horizontal" :list="tier.t_lst" group="docs" itemKey="label">
                                                    <template #item="{element}">
                                                        <div class="list-group-item">{{ element.label }}</div>
                                                    </template>
                                                </draggable>
                                            </div>
                                            <div class="col-sm-1 d-flex justify-content-center" @click="toggleTier(tier)">
                                                <i class="bi bi-chevron-down" v-if="tier.send_down"></i>
                                                <i class="bi bi-chevron-up" v-else></i>
                                            </div>
                                        </div>
                                        <div class="row mt-3" v-show="tier.send_down">
                                            <div class="col-sm-3">
                                                <select class="custom-select rev-select" v-model="tier.selected">
                                                    <option value="0">Select one</option>
                                                    <option value="1">Relevant</option>
                                                    <option value="2">Somewhat Relevant</option>
                                                    <option value="3">Irrelevant</option>
                                                </select>
                                            </div>
                                            <div class="col">
                                                <input type="text" class="form-control" placeholder="Description/Label" v-model="tier.description">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col d-flex justify-content-center">
                                <button class="btn-sm btn-secondary" @click="addTier()">
                                    Add Tier
                                </button>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col d-flex justify-content-center">
                                <textarea class="form-control" rows="3" placeholder="Overall Explanation" v-model="o_exp"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-3">
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
                        <div v-for="tab in tabs" v-show="tab.isActive">
                            <div class="row">
                            <div class="col">
                                <h5><strong>{{ tab.title }}</strong></h5>
                                <p v-html="tab_text" ref="absts">

                                </p>
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
                                </div>
                                <div class="row pb-2">
                                    <div class="col"><strong>Relevance</strong></div>
                                </div>
                                <div class="row pb-1" v-for="anno in tab.annot">
                                    <div class="col" style="padding-top:7px;">{{ anno.label }}:</div>
                                    <div class="col-8">
                                        <select class="custom-select rev-select" v-model="anno.anno">
                                            <option v-for="(cat, index) in anno.cats" v-bind:value="index">{{ cat }}</option>
                                        </select>
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
                tiers: [
                    {
                        rank: 1,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                    {
                        rank: 2,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                    {
                        rank: 3,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                ],
                o_exp: "",
                claim_selected: false,
                selected_claim: "",
            }
        },
        methods: {
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
            set_defaults() {
                this.redhot_post = "";
                this.tab_text = "";
                this.tabs = [];
                this.drag_tabs = [];
                this.tiers = [
                    {
                        rank: 1,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                    {
                        rank: 2,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                    {
                        rank: 3,
                        t_lst: [],
                        send_down: false,
                        selected: 0,
                        description: "",
                    },
                ];
                this.claim_selected = false;
                this.selected_claim = "";
            },
            load_file() {
                this.set_defaults();
                this.redhot_post = this.parsed_file[this.findex].text;
                let end_label = '</span>';
                const stage_2 = JSON.parse(this.parsed_file[this.findex].stage2_labels)[0]['crowd-entity-annotation']['entities'];
                let stage_2_tag = '<span class="high highBlue"><div class="hovbox">replace</div>';
                console.log(Object.keys(this.parsed_file[this.findex]));
                if (Object.keys(this.parsed_file[this.findex]).includes("stage1_labels")) {
                    const stage_1 = JSON.parse(this.parsed_file[this.findex].stage1_labels)[0]['crowd-entity-annotation']['entities'];
                    let stage_1_tag = '<span class="high highYellow" ><div class="hovbox">replace</div>';
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

                    let stage_2_tag_mod = stage_2_tag.replace('replace', label);
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
                        let s_claim = this.$refs.postcard.getElementsByClassName('highdYellow');
                        Array.from(s_claim).forEach((sc) => {
                            sc.addEventListener('click', (e) => {
                                if (e.target.style.border !== "") {
                                    Array.from(s_claim).forEach((s) => {s.style.border = ""; s.style['border-radius'] = '5px';});
                                    this.claim_selected = false;
                                    //this.selected_claim = "";
                                } else {
                                    Array.from(s_claim).forEach((s) => {s.style.border = ""; s.style['border-radius'] = '5px';});
                                    console.log(sc.innerHTML);
                                    let temp = document.createElement('div');
                                    temp.innerHTML = sc.innerHTML;
                                    const divs = temp.querySelectorAll('div');
                                    divs.forEach(div => div.remove());
                                    this.selected_claim = temp.textContent;
                                    this.claim_selected = true;
                                    sc.style.border = "2px solid #6aa84f";
                                    sc.style['border-radius'] = '5px';
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
                this.tabs = [];
                this.drag_tabs = [];
                let relvance_dict = {
                    0: "N/A",
                    1: "Relevant",
                    2: "Somewhat Relevant",
                    3: "Irrelevant"
                }
                let relevance_arr = [
                    "N/A",
                    "Relevant",
                    "Somewhat Relevant",
                    "Irrelevant",
                ]
                let r_class_dict = {
                    0: "btn-outline-secondary",
                    1: "btn-outline-success",
                    2: "btn-outline-warning",
                    3: "btn-outline-danger"
                }
                for (let i = 0; i < docs.length; i++) {
                    console.log("wft");
                    this.tabs.push({
                        label: docs[i]["label"],
                        title: titles[i],
                        doc: docs[i].text,
                        doc_claim: doc_claims[i],
                        isActive: false,
                        annot: (tab_annos !== null) ? tab_annos[i]:[{
                            label: "Overall",
                            anno: (annos_present) ? annos[i].text: 0,
                            cats: relevance_arr,
                        },
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
                        }]
                    });
                }
                console.log(this.tabs);
                if (picor_labels) {
                    for (let i = 0; i < docs.length; i++) {
                        this.tabs[i]['picor_label'] = picor_labels[i];
                    }
                }



                let copy = JSON.parse(JSON.stringify(this.tabs));

                this.drag_tabs = copy;



                if (Object.keys(this.parsed_file[this.findex]).includes("claim_annos")) {
                    let claim_annos = this.parsed_file[this.findex]['claim_annos'];
                    console.log("FOREE");
                    console.log(claim_annos);
                    this.drag_tabs = claim_annos['drag_tabs'].map((i) => copy[i]);
                    this.tiers = [];
                    for (let i = 0; i < claim_annos['tiers'].length; i++) {
                        this.tiers.push({
                            rank: i,
                            t_lst: claim_annos['tiers'][i]['t_lst'].map((i) => copy[i]),
                            send_down: claim_annos['tiers'][i]['send_down'],
                            selected: claim_annos['tiers'][i]['selected'],
                            description: claim_annos['tiers'][i]['description'],
                        });
                    }
                }

                this.setActive(this.tabs[0]);
            },
            save_state() {
                this.parsed_file[this.findex]['tab_annos'] = this.tabs.map((tab) => tab.annot);
                this.parsed_file[this.findex]['claim_annos'] = {};
                this.parsed_file[this.findex]['claim_annos']['annotated_claim'] = this.selected_claim; 
                this.parsed_file[this.findex]['claim_annos']['drag_tabs'] = this.drag_tabs.map((tab) => this.tabs.map((t) => t.title).indexOf(tab.title));
                this.parsed_file[this.findex]['claim_annos']['tiers'] = [];
                for (let i = 0; i < this.tiers.length; i++) {
                    this.parsed_file[this.findex]['claim_annos']['tiers'].push({
                        t_lst: this.tiers[i].t_lst.map((tab) => this.tabs.map((t) => t.title).indexOf(tab.title)),
                        send_down: this.tiers[i].send_down,
                        selected: this.tiers[i].selected,
                        description: this.tiers[i].description,
                    });
                }
            },
            setActive(tab) {
                for (let i = 0; i < this.tabs.length; i++) {
                    this.tabs[i].isActive = false;
                }
                tab.isActive = true;
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
                        let all_h = []
                        all_h.push({span:this.tabs[i].doc_claim, label:"Relevant Span", cname: "highGreen"});
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
                        for (let h of all_h) {
                            doc_copy = this.highlightPICOR(doc_copy, h.span, h.label, h.cname);
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
            toggleTier(tier) {
                tier.send_down = !tier.send_down;
            },
            addTier() {
                this.tiers.push(
                    {
                        rank: this.tiers.length + 1,
                        t_lst: [],
                        send_down: false,
                    }
                );
            },
            download_parsed_file() {
                this.save_state();
                const current_date = new Date();
                console.log(JSON.parse(JSON.stringify(this.parsed_file)));
                let end_object = JSON.stringify(this.parsed_file)
                end_object = end_object.replace(/[\u007F-\uFFFF]/g, function(chr) {
                                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
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

<style>

    .highYellow {
        background: rgb(243, 243, 162, 0.9);
    }
    .highBlue {
        background: rgb(173, 173, 250, 0.9);
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

    
    .rev-select option[value="1"] {
        background: rgb(175, 247, 175, 0.9);
    }

    .rev-select option[value="2"] {
        background: rgb(243, 243, 162, 0.9);

    }

    .rev-select option[value="3"] {
        background: rgba(243, 190, 176, 0.9);
    }



</style>