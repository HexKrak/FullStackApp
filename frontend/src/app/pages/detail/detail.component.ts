// import core libraries
import 'rxjs/add/operator/switchMap';
import { Location, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { MdSnackBar } from '@angular/material';

// import services
import { AnalyticsService } from '../../services/analytics.service';
import { ProductService } from '../../services/product.service';
import { WindowService } from '../../services/window.service';

// import models
import { Product } from '../../models/product';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public productDetail: Product;
  public recommendations: Product[];
  public _window: Window;
  
  constructor(
    private analyticsService: AnalyticsService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public snackBar: MdSnackBar,
    private windowService: WindowService,
  ) {
    //init this as an empty object because it will throw an error when reading the databindings if it's undefined
    this.productDetail = new Product();
    this._window = windowService.nativeWindow;
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.productService.getProductDetails( +params.get('productId') ))
      .subscribe(product => {
        this.productDetail = product;
        this.analyticsService.postEvent('details-' + product.id);
        this.getRecommendations(product.id);
      });
    
    this.router.events.subscribe((event: NavigationEnd) => {
      if(event instanceof NavigationEnd) {
        console.log(this._window);
        this._window.scrollTo(0, 0);
      }
    });
  }

  addToCart() {
    this.snackBar.open(`${this.productDetail.name} added to cart`, '', {
      duration: 500
    });
  }

  getRecommendations (productId: number) {
    this.productService.getRecommendations(productId)
                        .then( recommendations => { this.recommendations = recommendations});
  }

}
